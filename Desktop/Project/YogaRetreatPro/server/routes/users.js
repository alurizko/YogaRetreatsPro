import express from 'express'
import bcrypt from 'bcryptjs'
import { db } from '../index.js'
import { users, bookings, wishlist, reviews, retreats } from '../db/schema.js'
import { eq, desc } from 'drizzle-orm'
import { asyncHandler, createError } from '../middleware/errorHandler.js'

const router = express.Router()

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      avatar: users.avatar,
      role: users.role,
      isVerified: users.isVerified,
      createdAt: users.createdAt
    })
    .from(users)
    .where(eq(users.id, req.params.id))

  if (user.length === 0) {
    throw createError('User not found', 404)
  }

  res.json({
    success: true,
    data: user[0]
  })
}))

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', asyncHandler(async (req, res) => {
  const { firstName, lastName, avatar } = req.body

  const user = await db.select().from(users).where(eq(users.id, req.params.id))
  
  if (user.length === 0) {
    throw createError('User not found', 404)
  }

  const updatedUser = await db
    .update(users)
    .set({
      firstName: firstName || user[0].firstName,
      lastName: lastName || user[0].lastName,
      avatar: avatar || user[0].avatar,
      updatedAt: new Date()
    })
    .where(eq(users.id, req.params.id))
    .returning({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      avatar: users.avatar,
      role: users.role,
      isVerified: users.isVerified
    })

  res.json({
    success: true,
    data: updatedUser[0]
  })
}))

// @desc    Change password
// @route   PUT /api/users/:id/password
// @access  Private
router.put('/:id/password', asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    throw createError('Please provide current and new password', 400)
  }

  const user = await db.select().from(users).where(eq(users.id, req.params.id))
  
  if (user.length === 0) {
    throw createError('User not found', 404)
  }

  // Check current password
  const isMatch = await bcrypt.compare(currentPassword, user[0].password)
  if (!isMatch) {
    throw createError('Current password is incorrect', 400)
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword, salt)

  await db
    .update(users)
    .set({
      password: hashedPassword,
      updatedAt: new Date()
    })
    .where(eq(users.id, req.params.id))

  res.json({
    success: true,
    message: 'Password updated successfully'
  })
}))

// @desc    Get user bookings
// @route   GET /api/users/:id/bookings
// @access  Private
router.get('/:id/bookings', asyncHandler(async (req, res) => {
  const userBookings = await db
    .select({
      id: bookings.id,
      status: bookings.status,
      totalAmount: bookings.totalAmount,
      paymentStatus: bookings.paymentStatus,
      createdAt: bookings.createdAt,
      retreat: {
        id: retreats.id,
        title: retreats.title,
        location: retreats.location,
        startDate: retreats.startDate,
        endDate: retreats.endDate,
        images: retreats.images
      }
    })
    .from(bookings)
    .leftJoin(retreats, eq(bookings.retreatId, retreats.id))
    .where(eq(bookings.userId, req.params.id))
    .orderBy(desc(bookings.createdAt))

  res.json({
    success: true,
    data: userBookings
  })
}))

// @desc    Get user wishlist
// @route   GET /api/users/:id/wishlist
// @access  Private
router.get('/:id/wishlist', asyncHandler(async (req, res) => {
  const userWishlist = await db
    .select({
      id: wishlist.id,
      createdAt: wishlist.createdAt,
      retreat: {
        id: retreats.id,
        title: retreats.title,
        shortDescription: retreats.shortDescription,
        location: retreats.location,
        price: retreats.price,
        currency: retreats.currency,
        startDate: retreats.startDate,
        endDate: retreats.endDate,
        images: retreats.images,
        difficulty: retreats.difficulty
      }
    })
    .from(wishlist)
    .leftJoin(retreats, eq(wishlist.retreatId, retreats.id))
    .where(eq(wishlist.userId, req.params.id))
    .orderBy(desc(wishlist.createdAt))

  res.json({
    success: true,
    data: userWishlist
  })
}))

// @desc    Add retreat to wishlist
// @route   POST /api/users/:id/wishlist
// @access  Private
router.post('/:id/wishlist', asyncHandler(async (req, res) => {
  const { retreatId } = req.body

  if (!retreatId) {
    throw createError('Retreat ID is required', 400)
  }

  // Check if already in wishlist
  const existing = await db
    .select()
    .from(wishlist)
    .where(eq(wishlist.userId, req.params.id))
    .where(eq(wishlist.retreatId, retreatId))

  if (existing.length > 0) {
    throw createError('Retreat already in wishlist', 400)
  }

  const newWishlistItem = await db
    .insert(wishlist)
    .values({
      userId: parseInt(req.params.id),
      retreatId: parseInt(retreatId)
    })
    .returning()

  res.status(201).json({
    success: true,
    data: newWishlistItem[0]
  })
}))

// @desc    Remove retreat from wishlist
// @route   DELETE /api/users/:id/wishlist/:retreatId
// @access  Private
router.delete('/:id/wishlist/:retreatId', asyncHandler(async (req, res) => {
  await db
    .delete(wishlist)
    .where(eq(wishlist.userId, req.params.id))
    .where(eq(wishlist.retreatId, req.params.retreatId))

  res.json({
    success: true,
    message: 'Retreat removed from wishlist'
  })
}))

// @desc    Get user reviews
// @route   GET /api/users/:id/reviews
// @access  Private
router.get('/:id/reviews', asyncHandler(async (req, res) => {
  const userReviews = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      retreat: {
        id: retreats.id,
        title: retreats.title,
        images: retreats.images
      }
    })
    .from(reviews)
    .leftJoin(retreats, eq(reviews.retreatId, retreats.id))
    .where(eq(reviews.userId, req.params.id))
    .orderBy(desc(reviews.createdAt))

  res.json({
    success: true,
    data: userReviews
  })
}))

export default router
