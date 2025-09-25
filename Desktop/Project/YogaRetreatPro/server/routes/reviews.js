import express from 'express'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { reviews, users, retreats, bookings, reviewHelpful } from '../db/schema.js'
import { eq, desc, asc, and, sql, avg } from 'drizzle-orm'
import { asyncHandler, createError } from '../middleware/errorHandler.js'

const router = express.Router()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

const db = drizzle(pool)

// @desc    Get reviews for a retreat
// @route   GET /api/reviews/retreat/:retreatId
// @access  Public
router.get('/retreat/:retreatId', asyncHandler(async (req, res) => {
  const { retreatId } = req.params
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query

  const offset = (page - 1) * limit

  const retreatReviews = await db
    .select({
      id: reviews.id,
      overallRating: reviews.overallRating,
      locationRating: reviews.locationRating,
      accommodationRating: reviews.accommodationRating,
      foodRating: reviews.foodRating,
      instructorRating: reviews.instructorRating,
      valueRating: reviews.valueRating,
      title: reviews.title,
      comment: reviews.comment,
      pros: reviews.pros,
      cons: reviews.cons,
      images: reviews.images,
      isVerified: reviews.isVerified,
      isAnonymous: reviews.isAnonymous,
      helpfulCount: reviews.helpfulCount,
      createdAt: reviews.createdAt,
      user: {
        firstName: users.firstName,
        lastName: users.lastName,
        avatar: users.avatar
      }
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.retreatId, parseInt(retreatId)))
    .orderBy(sortOrder === 'desc' ? desc(reviews[sortBy]) : asc(reviews[sortBy]))
    .limit(parseInt(limit))
    .offset(offset)

  // Get total count
  const totalCount = await db
    .select({ count: sql`count(*)` })
    .from(reviews)
    .where(eq(reviews.retreatId, parseInt(retreatId)))

  // Get rating statistics
  const ratingStats = await db
    .select({
      avgOverall: avg(reviews.overallRating),
      avgLocation: avg(reviews.locationRating),
      avgAccommodation: avg(reviews.accommodationRating),
      avgFood: avg(reviews.foodRating),
      avgInstructor: avg(reviews.instructorRating),
      avgValue: avg(reviews.valueRating),
      totalReviews: sql`count(*)`
    })
    .from(reviews)
    .where(eq(reviews.retreatId, parseInt(retreatId)))

  res.json({
    success: true,
    data: {
      reviews: retreatReviews,
      statistics: ratingStats[0],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount[0].count),
        pages: Math.ceil(totalCount[0].count / limit)
      }
    }
  })
}))

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
router.post('/', asyncHandler(async (req, res) => {
  const {
    retreatId,
    bookingId,
    overallRating,
    locationRating,
    accommodationRating,
    foodRating,
    instructorRating,
    valueRating,
    title,
    comment,
    pros,
    cons,
    images,
    isAnonymous = false
  } = req.body

  // Validate required fields
  if (!retreatId || !overallRating) {
    throw createError('Retreat ID and overall rating are required', 400)
  }

  // Validate rating range
  const ratings = [overallRating, locationRating, accommodationRating, foodRating, instructorRating, valueRating]
  for (const rating of ratings) {
    if (rating && (rating < 1 || rating > 5)) {
      throw createError('Ratings must be between 1 and 5', 400)
    }
  }

  // Check if user has already reviewed this retreat
  const existingReview = await db
    .select()
    .from(reviews)
    .where(and(
      eq(reviews.userId, req.user.id),
      eq(reviews.retreatId, parseInt(retreatId))
    ))
    .limit(1)

  if (existingReview.length > 0) {
    throw createError('You have already reviewed this retreat', 400)
  }

  // Verify booking if provided
  let isVerified = false
  if (bookingId) {
    const booking = await db
      .select()
      .from(bookings)
      .where(and(
        eq(bookings.id, parseInt(bookingId)),
        eq(bookings.userId, req.user.id),
        eq(bookings.retreatId, parseInt(retreatId)),
        eq(bookings.status, 'completed')
      ))
      .limit(1)

    isVerified = booking.length > 0
  }

  const newReview = await db.insert(reviews).values({
    userId: req.user.id,
    retreatId: parseInt(retreatId),
    bookingId: bookingId ? parseInt(bookingId) : null,
    overallRating,
    locationRating,
    accommodationRating,
    foodRating,
    instructorRating,
    valueRating,
    title,
    comment,
    pros,
    cons,
    images,
    isVerified,
    isAnonymous
  }).returning()

  // Update retreat's average rating and review count
  const ratingStats = await db
    .select({
      avgRating: avg(reviews.overallRating),
      totalReviews: sql`count(*)`
    })
    .from(reviews)
    .where(eq(reviews.retreatId, parseInt(retreatId)))

  await db
    .update(retreats)
    .set({
      averageRating: ratingStats[0].avgRating,
      totalReviews: parseInt(ratingStats[0].totalReviews)
    })
    .where(eq(retreats.id, parseInt(retreatId)))

  res.status(201).json({
    success: true,
    data: newReview[0]
  })
}))

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
router.put('/:id', asyncHandler(async (req, res) => {
  const reviewId = parseInt(req.params.id)

  // Check if review exists and belongs to user
  const existingReview = await db
    .select()
    .from(reviews)
    .where(eq(reviews.id, reviewId))
    .limit(1)

  if (existingReview.length === 0) {
    throw createError('Review not found', 404)
  }

  if (existingReview[0].userId !== req.user.id) {
    throw createError('Not authorized to update this review', 403)
  }

  const updatedReview = await db
    .update(reviews)
    .set({ ...req.body, updatedAt: new Date() })
    .where(eq(reviews.id, reviewId))
    .returning()

  // Update retreat's average rating
  const ratingStats = await db
    .select({
      avgRating: avg(reviews.overallRating),
      totalReviews: sql`count(*)`
    })
    .from(reviews)
    .where(eq(reviews.retreatId, existingReview[0].retreatId))

  await db
    .update(retreats)
    .set({
      averageRating: ratingStats[0].avgRating,
      totalReviews: parseInt(ratingStats[0].totalReviews)
    })
    .where(eq(retreats.id, existingReview[0].retreatId))

  res.json({
    success: true,
    data: updatedReview[0]
  })
}))

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id', asyncHandler(async (req, res) => {
  const reviewId = parseInt(req.params.id)

  const existingReview = await db
    .select()
    .from(reviews)
    .where(eq(reviews.id, reviewId))
    .limit(1)

  if (existingReview.length === 0) {
    throw createError('Review not found', 404)
  }

  if (existingReview[0].userId !== req.user.id) {
    throw createError('Not authorized to delete this review', 403)
  }

  await db.delete(reviews).where(eq(reviews.id, reviewId))

  // Update retreat's average rating
  const ratingStats = await db
    .select({
      avgRating: avg(reviews.overallRating),
      totalReviews: sql`count(*)`
    })
    .from(reviews)
    .where(eq(reviews.retreatId, existingReview[0].retreatId))

  await db
    .update(retreats)
    .set({
      averageRating: ratingStats[0].avgRating || 0,
      totalReviews: parseInt(ratingStats[0].totalReviews) || 0
    })
    .where(eq(retreats.id, existingReview[0].retreatId))

  res.json({
    success: true,
    message: 'Review deleted successfully'
  })
}))

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
router.post('/:id/helpful', asyncHandler(async (req, res) => {
  const reviewId = parseInt(req.params.id)

  // Check if review exists
  const review = await db
    .select()
    .from(reviews)
    .where(eq(reviews.id, reviewId))
    .limit(1)

  if (review.length === 0) {
    throw createError('Review not found', 404)
  }

  // Check if user already marked this review as helpful
  const existingVote = await db
    .select()
    .from(reviewHelpful)
    .where(and(
      eq(reviewHelpful.reviewId, reviewId),
      eq(reviewHelpful.userId, req.user.id)
    ))
    .limit(1)

  if (existingVote.length > 0) {
    // Remove the helpful vote
    await db
      .delete(reviewHelpful)
      .where(and(
        eq(reviewHelpful.reviewId, reviewId),
        eq(reviewHelpful.userId, req.user.id)
      ))

    // Decrease helpful count
    await db
      .update(reviews)
      .set({ helpfulCount: sql`${reviews.helpfulCount} - 1` })
      .where(eq(reviews.id, reviewId))

    res.json({
      success: true,
      message: 'Helpful vote removed',
      helpful: false
    })
  } else {
    // Add helpful vote
    await db.insert(reviewHelpful).values({
      reviewId,
      userId: req.user.id
    })

    // Increase helpful count
    await db
      .update(reviews)
      .set({ helpfulCount: sql`${reviews.helpfulCount} + 1` })
      .where(eq(reviews.id, reviewId))

    res.json({
      success: true,
      message: 'Review marked as helpful',
      helpful: true
    })
  }
}))

export default router
