import express from 'express'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { retreats, users, reviews, bookings, categories, retreatCategories } from '../db/schema.js'
import { eq, desc, asc, and, gte, lte, sql, like, or, inArray } from 'drizzle-orm'
import { asyncHandler, createError } from '../middleware/errorHandler.js'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

const db = drizzle(pool)

const router = express.Router()

// @desc    Get all retreats with advanced filtering
// @route   GET /api/retreats
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 12, 
    search,
    country, 
    city,
    difficulty, 
    minPrice, 
    maxPrice, 
    startDate, 
    endDate,
    yogaStyles,
    categories: categoryFilter,
    minDuration,
    maxDuration,
    minAge,
    maxAge,
    languages,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query

  const offset = (page - 1) * limit
  
  // Build base query with joins
  let query = db
    .select({
      id: retreats.id,
      title: retreats.title,
      slug: retreats.slug,
      shortDescription: retreats.shortDescription,
      location: retreats.location,
      country: retreats.country,
      city: retreats.city,
      price: retreats.price,
      originalPrice: retreats.originalPrice,
      currency: retreats.currency,
      duration: retreats.duration,
      startDate: retreats.startDate,
      endDate: retreats.endDate,
      images: retreats.images,
      difficulty: retreats.difficulty,
      yogaStyles: retreats.yogaStyles,
      averageRating: retreats.averageRating,
      totalReviews: retreats.totalReviews,
      isFeatured: retreats.isFeatured,
      organizer: retreats.organizer,
      maxParticipants: retreats.maxParticipants,
      currentParticipants: retreats.currentParticipants,
      minAge: retreats.minAge,
      maxAge: retreats.maxAge,
      languages: retreats.languages
    })
    .from(retreats)
    .where(eq(retreats.isActive, true))

  const conditions = [eq(retreats.isActive, true)]

  // Text search
  if (search) {
    conditions.push(
      or(
        like(retreats.title, `%${search}%`),
        like(retreats.description, `%${search}%`),
        like(retreats.location, `%${search}%`),
        like(retreats.organizer, `%${search}%`)
      )
    )
  }

  // Location filters
  if (country) {
    conditions.push(eq(retreats.country, country))
  }
  if (city) {
    conditions.push(eq(retreats.city, city))
  }

  // Difficulty filter
  if (difficulty) {
    const difficulties = Array.isArray(difficulty) ? difficulty : [difficulty]
    conditions.push(inArray(retreats.difficulty, difficulties))
  }

  // Price filters
  if (minPrice) {
    conditions.push(gte(retreats.price, parseFloat(minPrice)))
  }
  if (maxPrice) {
    conditions.push(lte(retreats.price, parseFloat(maxPrice)))
  }

  // Date filters
  if (startDate) {
    conditions.push(gte(retreats.startDate, new Date(startDate)))
  }
  if (endDate) {
    conditions.push(lte(retreats.endDate, new Date(endDate)))
  }

  // Duration filters
  if (minDuration) {
    conditions.push(gte(retreats.duration, parseInt(minDuration)))
  }
  if (maxDuration) {
    conditions.push(lte(retreats.duration, parseInt(maxDuration)))
  }

  // Age filters
  if (minAge) {
    conditions.push(or(
      eq(retreats.minAge, null),
      lte(retreats.minAge, parseInt(minAge))
    ))
  }
  if (maxAge) {
    conditions.push(or(
      eq(retreats.maxAge, null),
      gte(retreats.maxAge, parseInt(maxAge))
    ))
  }

  // Category filter
  if (categoryFilter) {
    const categoryIds = Array.isArray(categoryFilter) ? categoryFilter : [categoryFilter]
    query = query
      .innerJoin(retreatCategories, eq(retreats.id, retreatCategories.retreatId))
      .innerJoin(categories, eq(retreatCategories.categoryId, categories.id))
    
    conditions.push(inArray(categories.id, categoryIds.map(id => parseInt(id))))
  }

  // Apply all conditions
  query = query.where(and(...conditions))

  // Apply sorting
  const validSortFields = ['createdAt', 'price', 'duration', 'startDate', 'averageRating', 'title']
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt'
  const orderBy = sortOrder === 'desc' ? desc(retreats[sortField]) : asc(retreats[sortField])
  
  query = query
    .orderBy(orderBy)
    .limit(parseInt(limit))
    .offset(offset)

  const retreatList = await query

  // Get total count with same filters
  let countQuery = db
    .select({ count: sql`count(DISTINCT ${retreats.id})` })
    .from(retreats)

  if (categoryFilter) {
    countQuery = countQuery
      .innerJoin(retreatCategories, eq(retreats.id, retreatCategories.retreatId))
      .innerJoin(categories, eq(retreatCategories.categoryId, categories.id))
  }

  const totalCount = await countQuery.where(and(...conditions))

  res.json({
    success: true,
    data: retreatList,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(totalCount[0].count),
      pages: Math.ceil(totalCount[0].count / limit)
    },
    filters: {
      search,
      country,
      city,
      difficulty,
      minPrice,
      maxPrice,
      startDate,
      endDate,
      categories: categoryFilter,
      minDuration,
      maxDuration,
      minAge,
      maxAge,
      sortBy: sortField,
      sortOrder
    }
  })
}))

// @desc    Get single retreat with full details
// @route   GET /api/retreats/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params
  
  // Get retreat by ID or slug
  const isNumeric = /^\d+$/.test(id)
  const retreat = await db
    .select()
    .from(retreats)
    .where(isNumeric ? eq(retreats.id, parseInt(id)) : eq(retreats.slug, id))
    .limit(1)
  
  if (retreat.length === 0) {
    throw createError('Retreat not found', 404)
  }

  const retreatData = retreat[0]

  // Increment view count
  await db
    .update(retreats)
    .set({ viewCount: sql`${retreats.viewCount} + 1` })
    .where(eq(retreats.id, retreatData.id))

  // Get retreat categories
  const retreatCats = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      color: categories.color,
      icon: categories.icon
    })
    .from(categories)
    .innerJoin(retreatCategories, eq(categories.id, retreatCategories.categoryId))
    .where(eq(retreatCategories.retreatId, retreatData.id))

  // Get retreat reviews with detailed ratings
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
    .where(eq(reviews.retreatId, retreatData.id))
    .orderBy(desc(reviews.createdAt))

  // Get organizer profile if exists
  const organizer = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      avatar: users.avatar,
      bio: users.bio
    })
    .from(users)
    .where(eq(users.id, retreatData.organizerId))
    .limit(1)

  res.json({
    success: true,
    data: {
      ...retreatData,
      categories: retreatCats,
      reviews: retreatReviews,
      organizer: organizer[0] || null
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
    originalPrice,
    currency = 'USD',
    duration,
    maxParticipants,
    minAge,
    maxAge,
    startDate,
    endDate,
    bookingDeadline,
    cancellationPolicy,
    images,
    amenities,
    included,
    notIncluded,
    schedule,
    difficulty,
    yogaStyles,
    languages,
    organizer,
    organizerId,
    instructors,
    categories: categoryIds
  } = req.body

  if (!title || !description || !location || !price || !duration || !maxParticipants || !startDate || !endDate) {
    throw createError('Please provide all required fields', 400)
  }

  // Generate slug from title
  const slug = title.toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')

  const newRetreat = await db.insert(retreats).values({
    title,
    slug,
    description,
    shortDescription,
    location,
    country,
    city,
    address,
    coordinates,
    price,
    originalPrice,
    currency,
    duration,
    maxParticipants,
    minAge,
    maxAge,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    bookingDeadline: bookingDeadline ? new Date(bookingDeadline) : null,
    cancellationPolicy,
    images,
    amenities,
    included,
    notIncluded,
    schedule,
    difficulty,
    yogaStyles,
    languages,
    organizer,
    organizerId,
    instructors
  }).returning()

  // Add categories if provided
  if (categoryIds && categoryIds.length > 0) {
    const categoryInserts = categoryIds.map(categoryId => ({
      retreatId: newRetreat[0].id,
      categoryId: parseInt(categoryId)
    }))
    
    await db.insert(retreatCategories).values(categoryInserts)
  }

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
    .select({
      id: retreats.id,
      title: retreats.title,
      slug: retreats.slug,
      shortDescription: retreats.shortDescription,
      location: retreats.location,
      country: retreats.country,
      city: retreats.city,
      price: retreats.price,
      originalPrice: retreats.originalPrice,
      currency: retreats.currency,
      duration: retreats.duration,
      startDate: retreats.startDate,
      endDate: retreats.endDate,
      images: retreats.images,
      difficulty: retreats.difficulty,
      averageRating: retreats.averageRating,
      totalReviews: retreats.totalReviews,
      organizer: retreats.organizer
    })
    .from(retreats)
    .where(and(eq(retreats.isActive, true), eq(retreats.isFeatured, true)))
    .orderBy(desc(retreats.createdAt))
    .limit(6)

  res.json({
    success: true,
    data: featuredRetreats
  })
}))

// @desc    Get retreat statistics
// @route   GET /api/retreats/stats
// @access  Public
router.get('/stats/overview', asyncHandler(async (req, res) => {
  const stats = await db
    .select({
      totalRetreats: sql`count(*)`,
      avgPrice: sql`avg(${retreats.price})`,
      avgRating: sql`avg(${retreats.averageRating})`,
      totalCountries: sql`count(DISTINCT ${retreats.country})`
    })
    .from(retreats)
    .where(eq(retreats.isActive, true))

  const popularCountries = await db
    .select({
      country: retreats.country,
      count: sql`count(*)`
    })
    .from(retreats)
    .where(eq(retreats.isActive, true))
    .groupBy(retreats.country)
    .orderBy(desc(sql`count(*)`))
    .limit(5)

  res.json({
    success: true,
    data: {
      ...stats[0],
      popularCountries
    }
  })
}))

export default router
