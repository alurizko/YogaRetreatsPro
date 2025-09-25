import express from 'express'
import { createClient } from '@supabase/supabase-js'
import { asyncHandler, createError } from '../middleware/errorHandler.js'
import crypto from 'crypto'

const router = express.Router()

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Ukrainian Payment Providers
const PAYMENT_PROVIDERS = {
  liqpay: {
    name: 'LiqPay',
    currency: 'UAH',
    createPayment: async (amount, orderId, description) => {
      const data = {
        version: '3',
        public_key: process.env.LIQPAY_PUBLIC_KEY,
        action: 'pay',
        amount: amount,
        currency: 'UAH',
        description: description,
        order_id: orderId,
        server_url: `${process.env.CLIENT_URL}/api/payments/liqpay/callback`
      }
      
      const dataBase64 = Buffer.from(JSON.stringify(data)).toString('base64')
      const signature = crypto
        .createHash('sha1')
        .update(process.env.LIQPAY_PRIVATE_KEY + dataBase64 + process.env.LIQPAY_PRIVATE_KEY)
        .digest('base64')
      
      return { data: dataBase64, signature }
    }
  },
  fondy: {
    name: 'Fondy',
    currency: 'UAH',
    createPayment: async (amount, orderId, description) => {
      const requestData = {
        order_id: orderId,
        merchant_id: process.env.FONDY_MERCHANT_ID,
        order_desc: description,
        amount: Math.round(amount * 100), // Convert to kopecks
        currency: 'UAH',
        server_callback_url: `${process.env.CLIENT_URL}/api/payments/fondy/callback`
      }
      
      // Generate signature for Fondy
      const signatureString = Object.keys(requestData)
        .sort()
        .map(key => `${key}=${requestData[key]}`)
        .join('|')
      
      const signature = crypto
        .createHash('sha1')
        .update(process.env.FONDY_SECRET_KEY + '|' + signatureString)
        .digest('sha1')
      
      return { ...requestData, signature }
    }
  },
  wayforpay: {
    name: 'WayForPay',
    currency: 'UAH',
    createPayment: async (amount, orderId, description) => {
      const requestData = {
        merchantAccount: process.env.WAYFORPAY_MERCHANT_ACCOUNT,
        merchantDomainName: process.env.CLIENT_URL,
        orderReference: orderId,
        orderDate: Math.floor(Date.now() / 1000),
        amount: amount,
        currency: 'UAH',
        productName: [description],
        productCount: [1],
        productPrice: [amount],
        serviceUrl: `${process.env.CLIENT_URL}/api/payments/wayforpay/callback`
      }
      
      // Generate signature for WayForPay
      const signatureFields = [
        requestData.merchantAccount,
        requestData.merchantDomainName,
        requestData.orderReference,
        requestData.orderDate,
        requestData.amount,
        requestData.currency,
        ...requestData.productName,
        ...requestData.productCount,
        ...requestData.productPrice
      ]
      
      const signatureString = signatureFields.join(';')
      const signature = crypto
        .createHmac('md5', process.env.WAYFORPAY_SECRET_KEY)
        .update(signatureString)
        .digest('hex')
      
      return { ...requestData, merchantSignature: signature }
    }
  }
}

// @desc    Create payment intent for Ukrainian providers
// @route   POST /api/payments/create-intent
// @access  Private
router.post('/create-intent', asyncHandler(async (req, res) => {
  const { bookingId, provider = 'liqpay' } = req.body

  if (!bookingId) {
    throw createError('Booking ID is required', 400)
  }

  if (!PAYMENT_PROVIDERS[provider]) {
    throw createError('Invalid payment provider', 400)
  }

  // Get booking details from Supabase
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select(`
      id,
      total_price,
      status,
      user_id,
      retreats (
        id,
        title,
        organizer
      )
    `)
    .eq('id', bookingId)
    .eq('user_id', req.user.id)
    .single()

  if (bookingError || !booking) {
    throw createError('Booking not found', 404)
  }

  if (booking.status === 'cancelled') {
    throw createError('Cannot pay for cancelled booking', 400)
  }

  // Generate unique order ID
  const orderId = `YRP_${booking.id}_${Date.now()}`
  const description = `Payment for retreat: ${booking.retreats.title}`
  const amount = parseFloat(booking.total_price)

  // Create payment with selected provider
  const paymentData = await PAYMENT_PROVIDERS[provider].createPayment(
    amount,
    orderId,
    description
  )

  // Save payment record in Supabase
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .insert({
      booking_id: booking.id,
      amount: amount,
      currency: 'UAH',
      payment_provider: provider,
      order_id: orderId,
      status: 'pending',
      metadata: paymentData
    })
    .select()
    .single()

  if (paymentError) {
    throw createError('Failed to create payment record', 500)
  }

  res.json({
    success: true,
    data: {
      paymentId: payment.id,
      orderId: orderId,
      provider: provider,
      amount: amount,
      currency: 'UAH',
      paymentData: paymentData
    }
  })
}))

// @desc    LiqPay callback handler
// @route   POST /api/payments/liqpay/callback
// @access  Public
router.post('/liqpay/callback', asyncHandler(async (req, res) => {
  const { data, signature } = req.body

  // Verify LiqPay signature
  const expectedSignature = crypto
    .createHash('sha1')
    .update(process.env.LIQPAY_PRIVATE_KEY + data + process.env.LIQPAY_PRIVATE_KEY)
    .digest('base64')

  if (signature !== expectedSignature) {
    return res.status(400).send('Invalid signature')
  }

  const paymentData = JSON.parse(Buffer.from(data, 'base64').toString())
  const orderId = paymentData.order_id
  const status = paymentData.status

  // Update payment and booking status
  if (status === 'success') {
    await updatePaymentStatus(orderId, 'completed', paymentData.transaction_id)
  } else if (status === 'failure' || status === 'error') {
    await updatePaymentStatus(orderId, 'failed', null, paymentData.err_description)
  }

  res.send('OK')
}))

// @desc    Fondy callback handler
// @route   POST /api/payments/fondy/callback
// @access  Public
router.post('/fondy/callback', asyncHandler(async (req, res) => {
  const paymentData = req.body
  const orderId = paymentData.order_id
  const status = paymentData.order_status

  // Verify Fondy signature
  const signatureFields = Object.keys(paymentData)
    .filter(key => key !== 'signature')
    .sort()
    .map(key => `${key}=${paymentData[key]}`)
    .join('|')

  const expectedSignature = crypto
    .createHash('sha1')
    .update(process.env.FONDY_SECRET_KEY + '|' + signatureFields)
    .digest('sha1')

  if (paymentData.signature !== expectedSignature) {
    return res.status(400).send('Invalid signature')
  }

  // Update payment and booking status
  if (status === 'approved') {
    await updatePaymentStatus(orderId, 'completed', paymentData.payment_id)
  } else if (status === 'declined') {
    await updatePaymentStatus(orderId, 'failed', null, paymentData.response_description)
  }

  res.send('OK')
}))

// @desc    WayForPay callback handler
// @route   POST /api/payments/wayforpay/callback
// @access  Public
router.post('/wayforpay/callback', asyncHandler(async (req, res) => {
  const paymentData = req.body
  const orderId = paymentData.orderReference
  const status = paymentData.transactionStatus

  // Verify WayForPay signature
  const signatureFields = [
    paymentData.merchantAccount,
    paymentData.orderReference,
    paymentData.amount,
    paymentData.currency
  ]

  const signatureString = signatureFields.join(';')
  const expectedSignature = crypto
    .createHmac('md5', process.env.WAYFORPAY_SECRET_KEY)
    .update(signatureString)
    .digest('hex')

  if (paymentData.merchantSignature !== expectedSignature) {
    return res.status(400).send('Invalid signature')
  }

  // Update payment and booking status
  if (status === 'Approved') {
    await updatePaymentStatus(orderId, 'completed', paymentData.authCode)
  } else if (status === 'Declined') {
    await updatePaymentStatus(orderId, 'failed', null, paymentData.reasonCode)
  }

  res.send('OK')
}))

// Helper function to update payment status
async function updatePaymentStatus(orderId, status, transactionId = null, failureReason = null) {
  // Update payment record
  const { data: payment } = await supabase
    .from('payments')
    .update({
      status: status,
      transaction_id: transactionId,
      failure_reason: failureReason,
      updated_at: new Date().toISOString()
    })
    .eq('order_id', orderId)
    .select('booking_id')
    .single()

  if (payment && status === 'completed') {
    // Update booking status
    await supabase
      .from('bookings')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.booking_id)
  } else if (payment && status === 'failed') {
    // Update booking status to failed
    await supabase
      .from('bookings')
      .update({
        payment_status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.booking_id)
  }
}

// @desc    Get available payment providers
// @route   GET /api/payments/providers
// @access  Public
router.get('/providers', asyncHandler(async (req, res) => {
  const providers = Object.keys(PAYMENT_PROVIDERS).map(key => ({
    id: key,
    name: PAYMENT_PROVIDERS[key].name,
    currency: PAYMENT_PROVIDERS[key].currency,
    available: !!(process.env[`${key.toUpperCase()}_PUBLIC_KEY`] || process.env[`${key.toUpperCase()}_MERCHANT_ID`] || process.env[`${key.toUpperCase()}_MERCHANT_ACCOUNT`])
  }))

  res.json({
    success: true,
    data: providers
  })
}))

// @desc    Get payment history
// @route   GET /api/payments
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query
  const offset = (page - 1) * limit

  const { data: userPayments, error } = await supabase
    .from('payments')
    .select(`
      id,
      amount,
      currency,
      payment_provider,
      status,
      created_at,
      bookings (
        id,
        booking_number,
        retreats (
          title,
          location
        )
      )
    `)
    .eq('bookings.user_id', req.user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    throw createError('Failed to fetch payment history', 500)
  }

  res.json({
    success: true,
    data: userPayments
  })
}))

// @desc    Request refund (manual process for Ukrainian providers)
// @route   POST /api/payments/:id/refund
// @access  Private
router.post('/:id/refund', asyncHandler(async (req, res) => {
  const { reason } = req.body
  const paymentId = parseInt(req.params.id)

  // Get payment details
  const { data: payment, error } = await supabase
    .from('payments')
    .select(`
      id,
      amount,
      status,
      payment_provider,
      bookings (
        id,
        user_id,
        status
      )
    `)
    .eq('id', paymentId)
    .eq('bookings.user_id', req.user.id)
    .single()

  if (error || !payment) {
    throw createError('Payment not found', 404)
  }

  if (payment.status !== 'completed') {
    throw createError('Can only refund completed payments', 400)
  }

  // For Ukrainian providers, refunds are typically manual processes
  // Create a refund request that needs to be processed manually
  const { data: refundRequest, error: refundError } = await supabase
    .from('refund_requests')
    .insert({
      payment_id: paymentId,
      booking_id: payment.bookings.id,
      amount: payment.amount,
      reason: reason || 'Customer requested refund',
      status: 'pending',
      requested_by: req.user.id
    })
    .select()
    .single()

  if (refundError) {
    throw createError('Failed to create refund request', 500)
  }

  // Update payment status to refund_requested
  await supabase
    .from('payments')
    .update({
      status: 'refund_requested',
      refund_reason: reason || 'Customer requested refund',
      updated_at: new Date().toISOString()
    })
    .eq('id', paymentId)

  res.json({
    success: true,
    message: 'Refund request submitted successfully. Our team will process it within 3-5 business days.',
    data: {
      refundRequestId: refundRequest.id,
      amount: payment.amount,
      status: 'pending'
    }
  })
}))

export default router
