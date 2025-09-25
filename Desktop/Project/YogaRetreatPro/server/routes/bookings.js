import express from 'express'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { bookings, retreats, users, payments } from '../db/schema.js'
import { eq, desc, asc, and, sql } from 'drizzle-orm'
import { asyncHandler, createError } from '../middleware/errorHandler.js'

const router = express.Router()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

const db = drizzle(pool)

// Generate unique booking number
function generateBookingNumber() {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `YRP-${timestamp}-${random}`.toUpperCase()
}

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
router.post('/', asyncHandler(async (req, res) => {
  const {
    retreatId,
    participants = 1,
    specialRequests,
    emergencyContact,
    dietaryRequirements,
    medicalConditions,
    couponCode
  } = req.body

  if (!retreatId) {
    throw createError('Retreat ID is required', 400)
  }

  // Get retreat details
  const retreat = await db
    .select()
    .from(retreats)
    .where(eq(retreats.id, parseInt(retreatId)))
    .limit(1)

  if (retreat.length === 0) {
    throw createError('Retreat not found', 404)
  }

  const retreatData = retreat[0]

  // Check availability
  if (retreatData.currentParticipants + participants > retreatData.maxParticipants) {
    throw createError('Not enough spots available', 400)
  }

  // Check booking deadline
  if (retreatData.bookingDeadline && new Date() > new Date(retreatData.bookingDeadline)) {
    throw createError('Booking deadline has passed', 400)
  }

  // Calculate pricing
  let totalAmount = parseFloat(retreatData.price) * participants
  let discountAmount = 0

  // Apply coupon if provided
  if (couponCode) {
    // TODO: Implement coupon logic
    // const coupon = await db.select().from(coupons).where(eq(coupons.code, couponCode))
    // Apply discount logic here
  }

  const finalAmount = totalAmount - discountAmount

  const bookingNumber = generateBookingNumber()

  const newBooking = await db.insert(bookings).values({
    bookingNumber,
    userId: req.user.id,
    retreatId: parseInt(retreatId),
    participants,
    totalAmount: totalAmount.toString(),
    discountAmount: discountAmount.toString(),
    finalAmount: finalAmount.toString(),
    specialRequests,
    emergencyContact,
    dietaryRequirements,
    medicalConditions,
    checkInDate: retreatData.startDate,
    checkOutDate: retreatData.endDate
  }).returning()

  // Update retreat participant count
  await db
    .update(retreats)
    .set({ 
      currentParticipants: sql`${retreats.currentParticipants} + ${participants}` 
    })
    .where(eq(retreats.id, parseInt(retreatId)))

  res.status(201).json({
    success: true,
    data: {
      ...newBooking[0],
      retreat: {
        title: retreatData.title,
        location: retreatData.location,
        startDate: retreatData.startDate,
        endDate: retreatData.endDate
      }
    }
  })
}))

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query
  const offset = (page - 1) * limit

  let query = db
    .select({
      id: bookings.id,
      bookingNumber: bookings.bookingNumber,
      status: bookings.status,
      participants: bookings.participants,
      totalAmount: bookings.totalAmount,
      finalAmount: bookings.finalAmount,
      paymentStatus: bookings.paymentStatus,
      checkInDate: bookings.checkInDate,
      checkOutDate: bookings.checkOutDate,
      createdAt: bookings.createdAt,
      retreat: {
        id: retreats.id,
        title: retreats.title,
        location: retreats.location,
        images: retreats.images,
        organizer: retreats.organizer
      }
    })
    .from(bookings)
    .innerJoin(retreats, eq(bookings.retreatId, retreats.id))
    .where(eq(bookings.userId, req.user.id))

  if (status) {
    query = query.where(eq(bookings.status, status))
  }

  const userBookings = await query
    .orderBy(desc(bookings.createdAt))
    .limit(parseInt(limit))
    .offset(offset)

  // Get total count
  const totalCount = await db
    .select({ count: sql`count(*)` })
    .from(bookings)
    .where(eq(bookings.userId, req.user.id))

  res.json({
    success: true,
    data: userBookings,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(totalCount[0].count),
      pages: Math.ceil(totalCount[0].count / limit)
    }
  })
}))

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', asyncHandler(async (req, res) => {
  const booking = await db
    .select({
      id: bookings.id,
      bookingNumber: bookings.bookingNumber,
      status: bookings.status,
      participants: bookings.participants,
      totalAmount: bookings.totalAmount,
      discountAmount: bookings.discountAmount,
      finalAmount: bookings.finalAmount,
      paymentStatus: bookings.paymentStatus,
      paymentMethod: bookings.paymentMethod,
      specialRequests: bookings.specialRequests,
      emergencyContact: bookings.emergencyContact,
      dietaryRequirements: bookings.dietaryRequirements,
      medicalConditions: bookings.medicalConditions,
      checkInDate: bookings.checkInDate,
      checkOutDate: bookings.checkOutDate,
      createdAt: bookings.createdAt,
      updatedAt: bookings.updatedAt,
      retreat: {
        id: retreats.id,
        title: retreats.title,
        location: retreats.location,
        country: retreats.country,
        city: retreats.city,
        images: retreats.images,
        organizer: retreats.organizer,
        startDate: retreats.startDate,
        endDate: retreats.endDate,
        cancellationPolicy: retreats.cancellationPolicy
      }
    })
    .from(bookings)
    .innerJoin(retreats, eq(bookings.retreatId, retreats.id))
    .where(and(
      eq(bookings.id, parseInt(req.params.id)),
      eq(bookings.userId, req.user.id)
    ))
    .limit(1)

  if (booking.length === 0) {
    throw createError('Booking not found', 404)
  }

  res.json({
    success: true,
    data: booking[0]
  })
}))

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
router.put('/:id/status', asyncHandler(async (req, res) => {
  const { status } = req.body
  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'refunded']

  if (!validStatuses.includes(status)) {
    throw createError('Invalid status', 400)
  }

  // Check if booking exists and belongs to user
  const existingBooking = await db
    .select()
    .from(bookings)
    .where(and(
      eq(bookings.id, parseInt(req.params.id)),
      eq(bookings.userId, req.user.id)
    ))
    .limit(1)

  if (existingBooking.length === 0) {
    throw createError('Booking not found', 404)
  }

  const updatedBooking = await db
    .update(bookings)
    .set({ 
      status,
      updatedAt: new Date()
    })
    .where(eq(bookings.id, parseInt(req.params.id)))
    .returning()

  // If cancelling, update retreat participant count
  if (status === 'cancelled' && existingBooking[0].status !== 'cancelled') {
    await db
      .update(retreats)
      .set({ 
        currentParticipants: sql`${retreats.currentParticipants} - ${existingBooking[0].participants}` 
      })
      .where(eq(retreats.id, existingBooking[0].retreatId))
  }

  res.json({
    success: true,
    data: updatedBooking[0]
  })
}))

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
router.delete('/:id', asyncHandler(async (req, res) => {
  const booking = await db
    .select()
    .from(bookings)
    .where(and(
      eq(bookings.id, parseInt(req.params.id)),
      eq(bookings.userId, req.user.id)
    ))
    .limit(1)

  if (booking.length === 0) {
    throw createError('Booking not found', 404)
  }

  if (booking[0].status === 'completed') {
    throw createError('Cannot cancel completed booking', 400)
  }

  // Update status to cancelled instead of deleting
  await db
    .update(bookings)
    .set({ 
      status: 'cancelled',
      updatedAt: new Date()
    })
    .where(eq(bookings.id, parseInt(req.params.id)))

  // Update retreat participant count
  if (booking[0].status !== 'cancelled') {
    await db
      .update(retreats)
      .set({ 
        currentParticipants: sql`${retreats.currentParticipants} - ${booking[0].participants}` 
      })
      .where(eq(retreats.id, booking[0].retreatId))
  }

  res.json({
    success: true,
    message: 'Booking cancelled successfully'
  })
}))

export default router
