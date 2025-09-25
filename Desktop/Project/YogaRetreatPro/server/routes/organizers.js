import express from 'express'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { organizerProfiles, users, retreats, bookings, reviews } from '../db/schema.js'
import { eq, desc, asc, and, sql, avg, count } from 'drizzle-orm'
import { asyncHandler, createError } from '../middleware/errorHandler.js'

const router = express.Router()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

const db = drizzle(pool)

// @desc    Create organizer profile
// @route   POST /api/organizers/profile
// @access  Private
router.post('/profile', asyncHandler(async (req, res) => {
  const {
    companyName,
    website,
    description,
    specialties,
    certifications,
    experience,
    socialMedia,
    businessLicense,
    insuranceInfo
  } = req.body

  // Check if profile already exists
  const existingProfile = await db
    .select()
    .from(organizerProfiles)
    .where(eq(organizerProfiles.userId, req.user.id))
    .limit(1)

  if (existingProfile.length > 0) {
    throw createError('Organizer profile already exists', 400)
  }

  // Update user role to organizer
  await db
    .update(users)
    .set({ role: 'organizer' })
    .where(eq(users.id, req.user.id))

  const newProfile = await db.insert(organizerProfiles).values({
    userId: req.user.id,
    companyName,
    website,
    description,
    specialties,
    certifications,
    experience: experience ? parseInt(experience) : null,
    socialMedia,
    businessLicense,
    insuranceInfo
  }).returning()

  res.status(201).json({
    success: true,
    data: newProfile[0]
  })
}))

// @desc    Get organizer profile
// @route   GET /api/organizers/profile
// @access  Private
router.get('/profile', asyncHandler(async (req, res) => {
  const profile = await db
    .select({
      id: organizerProfiles.id,
      companyName: organizerProfiles.companyName,
      website: organizerProfiles.website,
      description: organizerProfiles.description,
      specialties: organizerProfiles.specialties,
      certifications: organizerProfiles.certifications,
      experience: organizerProfiles.experience,
      socialMedia: organizerProfiles.socialMedia,
      businessLicense: organizerProfiles.businessLicense,
      insuranceInfo: organizerProfiles.insuranceInfo,
      isVerified: organizerProfiles.isVerified,
      rating: organizerProfiles.rating,
      totalRetreats: organizerProfiles.totalRetreats,
      createdAt: organizerProfiles.createdAt,
      user: {
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        avatar: users.avatar,
        bio: users.bio
      }
    })
    .from(organizerProfiles)
    .innerJoin(users, eq(organizerProfiles.userId, users.id))
    .where(eq(organizerProfiles.userId, req.user.id))
    .limit(1)

  if (profile.length === 0) {
    throw createError('Organizer profile not found', 404)
  }

  res.json({
    success: true,
    data: profile[0]
  })
}))

// @desc    Update organizer profile
// @route   PUT /api/organizers/profile
// @access  Private
router.put('/profile', asyncHandler(async (req, res) => {
  const existingProfile = await db
    .select()
    .from(organizerProfiles)
    .where(eq(organizerProfiles.userId, req.user.id))
    .limit(1)

  if (existingProfile.length === 0) {
    throw createError('Organizer profile not found', 404)
  }

  const updatedProfile = await db
    .update(organizerProfiles)
    .set({ ...req.body, updatedAt: new Date() })
    .where(eq(organizerProfiles.userId, req.user.id))
    .returning()

  res.json({
    success: true,
    data: updatedProfile[0]
  })
}))

// @desc    Get organizer's retreats
// @route   GET /api/organizers/retreats
// @access  Private
router.get('/retreats', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query
  const offset = (page - 1) * limit

  let query = db
    .select({
      id: retreats.id,
      title: retreats.title,
      slug: retreats.slug,
      location: retreats.location,
      country: retreats.country,
      price: retreats.price,
      currency: retreats.currency,
      duration: retreats.duration,
      maxParticipants: retreats.maxParticipants,
      currentParticipants: retreats.currentParticipants,
      startDate: retreats.startDate,
      endDate: retreats.endDate,
      images: retreats.images,
      isActive: retreats.isActive,
      isFeatured: retreats.isFeatured,
      isVerified: retreats.isVerified,
      averageRating: retreats.averageRating,
      totalReviews: retreats.totalReviews,
      viewCount: retreats.viewCount,
      createdAt: retreats.createdAt
    })
    .from(retreats)
    .where(eq(retreats.organizerId, req.user.id))

  if (status) {
    query = query.where(eq(retreats.isActive, status === 'active'))
  }

  const organizerRetreats = await query
    .orderBy(desc(retreats.createdAt))
    .limit(parseInt(limit))
    .offset(offset)

  // Get total count
  const totalCount = await db
    .select({ count: sql`count(*)` })
    .from(retreats)
    .where(eq(retreats.organizerId, req.user.id))

  res.json({
    success: true,
    data: organizerRetreats,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(totalCount[0].count),
      pages: Math.ceil(totalCount[0].count / limit)
    }
  })
}))

// @desc    Get organizer's bookings
// @route   GET /api/organizers/bookings
// @access  Private
router.get('/bookings', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query
  const offset = (page - 1) * limit

  let query = db
    .select({
      id: bookings.id,
      bookingNumber: bookings.bookingNumber,
      status: bookings.status,
      participants: bookings.participants,
      finalAmount: bookings.finalAmount,
      paymentStatus: bookings.paymentStatus,
      checkInDate: bookings.checkInDate,
      checkOutDate: bookings.checkOutDate,
      createdAt: bookings.createdAt,
      retreat: {
        id: retreats.id,
        title: retreats.title,
        location: retreats.location
      },
      user: {
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email
      }
    })
    .from(bookings)
    .innerJoin(retreats, eq(bookings.retreatId, retreats.id))
    .innerJoin(users, eq(bookings.userId, users.id))
    .where(eq(retreats.organizerId, req.user.id))

  if (status) {
    query = query.where(eq(bookings.status, status))
  }

  const organizerBookings = await query
    .orderBy(desc(bookings.createdAt))
    .limit(parseInt(limit))
    .offset(offset)

  res.json({
    success: true,
    data: organizerBookings
  })
}))

// @desc    Get organizer dashboard stats
// @route   GET /api/organizers/stats
// @access  Private
router.get('/stats', asyncHandler(async (req, res) => {
  // Get retreat stats
  const retreatStats = await db
    .select({
      totalRetreats: count(retreats.id),
      activeRetreats: sql`count(case when ${retreats.isActive} = true then 1 end)`,
      totalViews: sql`sum(${retreats.viewCount})`,
      avgRating: avg(retreats.averageRating)
    })
    .from(retreats)
    .where(eq(retreats.organizerId, req.user.id))

  // Get booking stats
  const bookingStats = await db
    .select({
      totalBookings: count(bookings.id),
      confirmedBookings: sql`count(case when ${bookings.status} = 'confirmed' then 1 end)`,
      totalRevenue: sql`sum(case when ${bookings.paymentStatus} = 'paid' then ${bookings.finalAmount} else 0 end)`,
      totalParticipants: sql`sum(${bookings.participants})`
    })
    .from(bookings)
    .innerJoin(retreats, eq(bookings.retreatId, retreats.id))
    .where(eq(retreats.organizerId, req.user.id))

  // Get recent reviews
  const recentReviews = await db
    .select({
      id: reviews.id,
      overallRating: reviews.overallRating,
      title: reviews.title,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      user: {
        firstName: users.firstName,
        lastName: users.lastName
      },
      retreat: {
        title: retreats.title
      }
    })
    .from(reviews)
    .innerJoin(retreats, eq(reviews.retreatId, retreats.id))
    .innerJoin(users, eq(reviews.userId, users.id))
    .where(eq(retreats.organizerId, req.user.id))
    .orderBy(desc(reviews.createdAt))
    .limit(5)

  res.json({
    success: true,
    data: {
      retreats: retreatStats[0],
      bookings: bookingStats[0],
      recentReviews
    }
  })
}))

// @desc    Get public organizer profile
// @route   GET /api/organizers/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const organizerId = parseInt(req.params.id)

  const organizer = await db
    .select({
      id: organizerProfiles.id,
      companyName: organizerProfiles.companyName,
      website: organizerProfiles.website,
      description: organizerProfiles.description,
      specialties: organizerProfiles.specialties,
      certifications: organizerProfiles.certifications,
      experience: organizerProfiles.experience,
      socialMedia: organizerProfiles.socialMedia,
      isVerified: organizerProfiles.isVerified,
      rating: organizerProfiles.rating,
      totalRetreats: organizerProfiles.totalRetreats,
      createdAt: organizerProfiles.createdAt,
      user: {
        firstName: users.firstName,
        lastName: users.lastName,
        avatar: users.avatar,
        bio: users.bio
      }
    })
    .from(organizerProfiles)
    .innerJoin(users, eq(organizerProfiles.userId, users.id))
    .where(eq(organizerProfiles.userId, organizerId))
    .limit(1)

  if (organizer.length === 0) {
    throw createError('Organizer not found', 404)
  }

  // Get organizer's active retreats
  const organizerRetreats = await db
    .select({
      id: retreats.id,
      title: retreats.title,
      slug: retreats.slug,
      location: retreats.location,
      price: retreats.price,
      currency: retreats.currency,
      duration: retreats.duration,
      startDate: retreats.startDate,
      images: retreats.images,
      averageRating: retreats.averageRating,
      totalReviews: retreats.totalReviews
    })
    .from(retreats)
    .where(and(
      eq(retreats.organizerId, organizerId),
      eq(retreats.isActive, true)
    ))
    .orderBy(desc(retreats.createdAt))
    .limit(6)

  res.json({
    success: true,
    data: {
      ...organizer[0],
      retreats: organizerRetreats
    }
  })
}))

// @desc    Get all verified organizers
// @route   GET /api/organizers
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 12 } = req.query
  const offset = (page - 1) * limit

  const organizers = await db
    .select({
      id: organizerProfiles.id,
      companyName: organizerProfiles.companyName,
      description: organizerProfiles.description,
      specialties: organizerProfiles.specialties,
      experience: organizerProfiles.experience,
      isVerified: organizerProfiles.isVerified,
      rating: organizerProfiles.rating,
      totalRetreats: organizerProfiles.totalRetreats,
      user: {
        firstName: users.firstName,
        lastName: users.lastName,
        avatar: users.avatar
      }
    })
    .from(organizerProfiles)
    .innerJoin(users, eq(organizerProfiles.userId, users.id))
    .where(eq(organizerProfiles.isVerified, true))
    .orderBy(desc(organizerProfiles.rating))
    .limit(parseInt(limit))
    .offset(offset)

  res.json({
    success: true,
    data: organizers
  })
}))

export default router
