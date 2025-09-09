import express from 'express'
import { db } from '../index.js'
import { retreats, users, reviews, bookings } from '../db/schema.js'
import { eq, desc, asc, and, gte, lte, sql } from 'drizzle-orm'
import { asyncHandler, createError } from '../middleware/errorHandler.js'

const router = express.Router()

// @desc    Get all retreats
// @route   GET /api/retreats
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 12, 
    country, 
    difficulty, 
    minPrice, 
    maxPrice, 
    startDate, 
    endDate,
    yogaStyles,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query

  const offset = (page - 1) * limit
  let query = db.select().from(retreats).where(eq(retreats.isActive, true))

  // Apply filters
  if (country) {
    query = query.where(eq(retreats.country, country))
  }
  if (difficulty) {
    query = query.where(eq(retreats.difficulty, difficulty))
  }
  if (minPrice) {
    query = query.where(gte(retreats.price, minPrice))
  }
  if (maxPrice) {
    query = query.where(lte(retreats.price, maxPrice))
  }
  if (startDate) {
    query = query.where(gte(retreats.startDate, new Date(startDate)))
  }
  if (endDate) {
    query = query.where(lte(retreats.endDate, new Date(endDate)))
  }

  // Apply sorting
  const orderBy = sortOrder === 'desc' ? desc(retreats[sortBy]) : asc(retreats[sortBy])
  query = query.orderBy(orderBy).limit(parseInt(limit)).offset(offset)

  const retreatList = await query

  // Get total count for pagination
  const totalCount = await db.select({ count: sql`count(*)` }).from(retreats).where(eq(retreats.isActive, true))

  res.json({
    success: true,
    data: retreatList,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(totalCount[0].count),
      pages: Math.ceil(totalCount[0].count / limit)
    }
  })
}))

// @desc    Get single retreat
// @route   GET /api/retreats/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const retreat = await db.select().from(retreats).where(eq(retreats.id, req.params.id))
  
  if (retreat.length === 0) {
    throw createError('Retreat not found', 404)
  }

  // Get retreat reviews
  const retreatReviews = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      user: {
        firstName: users.firstName,
        lastName: users.lastName,
        avatar: users.avatar
      }
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.retreatId, req.params.id))
    .orderBy(desc(reviews.createdAt))

  res.json({
    success: true,
    data: {
      ...retreat[0],
      reviews: retreatReviews
    }
  })
}))

// @desc    Create new retreat
// @route   POST /api/retreats
// @access  Private (Admin/Organizer)
router.post('/', asyncHandler(async (req, res) => {
  const {
    title,
    description,
    shortDescription,
    location,
    country,
    city,
    address,
    coordinates,
    price,
    currency = 'USD',
    duration,
    maxParticipants,
    startDate,
    endDate,
    images,
    amenities,
    included,
    notIncluded,
    difficulty,
    yogaStyles,
    organizer,
    organizerId
  } = req.body

  if (!title || !description || !location || !price || !duration || !maxParticipants || !startDate || !endDate) {
    throw createError('Please provide all required fields', 400)
  }

  const newRetreat = await db.insert(retreats).values({
    title,
    description,
    shortDescription,
    location,
    country,
    city,
    address,
    coordinates,
    price,
    currency,
    duration,
    maxParticipants,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    images,
    amenities,
    included,
    notIncluded,
    difficulty,
    yogaStyles,
    organizer,
    organizerId
  }).returning()

  res.status(201).json({
    success: true,
    data: newRetreat[0]
  })
}))

// @desc    Update retreat
// @route   PUT /api/retreats/:id
// @access  Private (Admin/Organizer)
router.put('/:id', asyncHandler(async (req, res) => {
  const retreat = await db.select().from(retreats).where(eq(retreats.id, req.params.id))
  
  if (retreat.length === 0) {
    throw createError('Retreat not found', 404)
  }

  const updatedRetreat = await db
    .update(retreats)
    .set({ ...req.body, updatedAt: new Date() })
    .where(eq(retreats.id, req.params.id))
    .returning()

  res.json({
    success: true,
    data: updatedRetreat[0]
  })
}))

// @desc    Delete retreat
// @route   DELETE /api/retreats/:id
// @access  Private (Admin/Organizer)
router.delete('/:id', asyncHandler(async (req, res) => {
  const retreat = await db.select().from(retreats).where(eq(retreats.id, req.params.id))
  
  if (retreat.length === 0) {
    throw createError('Retreat not found', 404)
  }

  await db.delete(retreats).where(eq(retreats.id, req.params.id))

  res.json({
    success: true,
    message: 'Retreat deleted successfully'
  })
}))

// @desc    Get featured retreats
// @route   GET /api/retreats/featured
// @access  Public
router.get('/featured/list', asyncHandler(async (req, res) => {
  const featuredRetreats = await db
    .select()
    .from(retreats)
    .where(and(eq(retreats.isActive, true), eq(retreats.isFeatured, true)))
    .orderBy(desc(retreats.createdAt))
    .limit(6)

  res.json({
    success: true,
    data: featuredRetreats
  })
}))

export default router
