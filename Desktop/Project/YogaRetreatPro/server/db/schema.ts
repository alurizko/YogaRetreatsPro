import { pgTable, serial, varchar, text, integer, decimal, boolean, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  avatar: varchar('avatar', { length: 500 }),
  bio: text('bio'),
  phone: varchar('phone', { length: 20 }),
  dateOfBirth: timestamp('date_of_birth'),
  gender: varchar('gender', { length: 10 }),
  nationality: varchar('nationality', { length: 100 }),
  languages: jsonb('languages'), // array of language codes
  role: varchar('role', { length: 20 }).notNull().default('user'), // 'user', 'admin', 'organizer'
  isVerified: boolean('is_verified').notNull().default(false),
  emailVerified: boolean('email_verified').notNull().default(false),
  phoneVerified: boolean('phone_verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 100 }),
  color: varchar('color', { length: 7 }), // hex color
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

// Retreat categories junction table
export const retreatCategories = pgTable('retreat_categories', {
  id: serial('id').primaryKey(),
  retreatId: integer('retreat_id').notNull().references(() => retreats.id),
  categoryId: integer('category_id').notNull().references(() => categories.id),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

// Retreats table
export const retreats = pgTable('retreats', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  shortDescription: varchar('short_description', { length: 500 }),
  location: varchar('location', { length: 255 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  address: text('address'),
  coordinates: jsonb('coordinates'), // { lat: number, lng: number }
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal('original_price', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  duration: integer('duration').notNull(), // days
  maxParticipants: integer('max_participants').notNull(),
  currentParticipants: integer('current_participants').notNull().default(0),
  minAge: integer('min_age'),
  maxAge: integer('max_age'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  bookingDeadline: timestamp('booking_deadline'),
  cancellationPolicy: text('cancellation_policy'),
  images: jsonb('images'), // array of image URLs
  amenities: jsonb('amenities'), // array of amenity strings
  included: jsonb('included'), // array of included items
  notIncluded: jsonb('not_included'), // array of not included items
  schedule: jsonb('schedule'), // daily schedule
  difficulty: varchar('difficulty', { length: 20 }).notNull(), // 'beginner', 'intermediate', 'advanced', 'all_levels'
  yogaStyles: jsonb('yoga_styles'), // array of yoga style strings
  languages: jsonb('languages'), // array of language codes
  organizer: varchar('organizer', { length: 255 }).notNull(),
  organizerId: integer('organizer_id').references(() => users.id),
  instructors: jsonb('instructors'), // array of instructor objects
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0'),
  totalReviews: integer('total_reviews').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  isFeatured: boolean('is_featured').notNull().default(false),
  isVerified: boolean('is_verified').notNull().default(false),
  viewCount: integer('view_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// Bookings table
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  bookingNumber: varchar('booking_number', { length: 20 }).notNull().unique(),
  userId: integer('user_id').notNull().references(() => users.id),
  retreatId: integer('retreat_id').notNull().references(() => retreats.id),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending', 'confirmed', 'cancelled', 'completed', 'refunded'
  participants: integer('participants').notNull().default(1),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0'),
  finalAmount: decimal('final_amount', { precision: 10, scale: 2 }).notNull(),
  paymentStatus: varchar('payment_status', { length: 20 }).notNull().default('pending'), // 'pending', 'paid', 'partial', 'refunded', 'failed'
  paymentMethod: varchar('payment_method', { length: 50 }),
  paymentIntentId: varchar('payment_intent_id', { length: 255 }),
  specialRequests: text('special_requests'),
  emergencyContact: jsonb('emergency_contact'),
  dietaryRequirements: text('dietary_requirements'),
  medicalConditions: text('medical_conditions'),
  checkInDate: timestamp('check_in_date'),
  checkOutDate: timestamp('check_out_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// Wishlist table
export const wishlist = pgTable('wishlist', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  retreatId: integer('retreat_id').notNull().references(() => retreats.id),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

// Reviews table
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  retreatId: integer('retreat_id').notNull().references(() => retreats.id),
  bookingId: integer('booking_id').references(() => bookings.id),
  overallRating: integer('overall_rating').notNull(), // 1-5
  locationRating: integer('location_rating'), // 1-5
  accommodationRating: integer('accommodation_rating'), // 1-5
  foodRating: integer('food_rating'), // 1-5
  instructorRating: integer('instructor_rating'), // 1-5
  valueRating: integer('value_rating'), // 1-5
  title: varchar('title', { length: 255 }),
  comment: text('comment'),
  pros: text('pros'),
  cons: text('cons'),
  images: jsonb('images'), // array of review image URLs
  isVerified: boolean('is_verified').notNull().default(false), // verified purchase
  isAnonymous: boolean('is_anonymous').notNull().default(false),
  helpfulCount: integer('helpful_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// Review helpful votes
export const reviewHelpful = pgTable('review_helpful', {
  id: serial('id').primaryKey(),
  reviewId: integer('review_id').notNull().references(() => reviews.id),
  userId: integer('user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

// Organizer profiles
export const organizerProfiles = pgTable('organizer_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  companyName: varchar('company_name', { length: 255 }),
  website: varchar('website', { length: 255 }),
  description: text('description'),
  specialties: jsonb('specialties'), // array of specialty strings
  certifications: jsonb('certifications'), // array of certification objects
  experience: integer('experience'), // years of experience
  socialMedia: jsonb('social_media'), // object with social media links
  businessLicense: varchar('business_license', { length: 255 }),
  insuranceInfo: jsonb('insurance_info'),
  bankDetails: jsonb('bank_details'), // encrypted bank account details
  taxInfo: jsonb('tax_info'),
  isVerified: boolean('is_verified').notNull().default(false),
  verificationDocuments: jsonb('verification_documents'),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  totalRetreats: integer('total_retreats').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// Payment transactions
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  bookingId: integer('booking_id').notNull().references(() => bookings.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(), // 'card', 'paypal', 'bank_transfer'
  paymentProvider: varchar('payment_provider', { length: 50 }), // 'stripe', 'paypal'
  transactionId: varchar('transaction_id', { length: 255 }),
  paymentIntentId: varchar('payment_intent_id', { length: 255 }),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending', 'completed', 'failed', 'refunded'
  failureReason: text('failure_reason'),
  refundAmount: decimal('refund_amount', { precision: 10, scale: 2 }),
  refundReason: text('refund_reason'),
  processingFee: decimal('processing_fee', { precision: 10, scale: 2 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// Blog posts
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  featuredImage: varchar('featured_image', { length: 500 }),
  authorId: integer('author_id').notNull().references(() => users.id),
  categoryId: integer('category_id').references(() => blogCategories.id),
  tags: jsonb('tags'), // array of tag strings
  status: varchar('status', { length: 20 }).notNull().default('draft'), // 'draft', 'published', 'archived'
  publishedAt: timestamp('published_at'),
  viewCount: integer('view_count').notNull().default(0),
  readingTime: integer('reading_time'), // estimated reading time in minutes
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// Blog categories
export const blogCategories = pgTable('blog_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  color: varchar('color', { length: 7 }),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

// Coupons and discounts
export const coupons = pgTable('coupons', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 20 }).notNull(), // 'percentage', 'fixed_amount'
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  minAmount: decimal('min_amount', { precision: 10, scale: 2 }),
  maxDiscount: decimal('max_discount', { precision: 10, scale: 2 }),
  usageLimit: integer('usage_limit'),
  usedCount: integer('used_count').notNull().default(0),
  validFrom: timestamp('valid_from').notNull(),
  validUntil: timestamp('valid_until').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  applicableRetreats: jsonb('applicable_retreats'), // array of retreat IDs or null for all
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// Notifications
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  type: varchar('type', { length: 50 }).notNull(), // 'booking_confirmed', 'payment_received', 'review_request', etc.
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  data: jsonb('data'), // additional data for the notification
  isRead: boolean('is_read').notNull().default(false),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

// FAQ
export const faqs = pgTable('faqs', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: varchar('category', { length: 100 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  bookings: many(bookings),
  wishlist: many(wishlist),
  reviews: many(reviews),
  organizedRetreats: many(retreats),
  organizerProfile: one(organizerProfiles),
  blogPosts: many(blogPosts),
  notifications: many(notifications)
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
  retreatCategories: many(retreatCategories)
}))

export const retreatCategoriesRelations = relations(retreatCategories, ({ one }) => ({
  retreat: one(retreats, {
    fields: [retreatCategories.retreatId],
    references: [retreats.id]
  }),
  category: one(categories, {
    fields: [retreatCategories.categoryId],
    references: [categories.id]
  })
}))

export const retreatsRelations = relations(retreats, ({ one, many }) => ({
  organizer: one(users, {
    fields: [retreats.organizerId],
    references: [users.id]
  }),
  bookings: many(bookings),
  wishlist: many(wishlist),
  reviews: many(reviews),
  retreatCategories: many(retreatCategories)
}))

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id]
  }),
  retreat: one(retreats, {
    fields: [bookings.retreatId],
    references: [retreats.id]
  }),
  payments: many(payments)
}))

export const wishlistRelations = relations(wishlist, ({ one }) => ({
  user: one(users, {
    fields: [wishlist.userId],
    references: [users.id]
  }),
  retreat: one(retreats, {
    fields: [wishlist.retreatId],
    references: [retreats.id]
  })
}))

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id]
  }),
  retreat: one(retreats, {
    fields: [reviews.retreatId],
    references: [retreats.id]
  }),
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id]
  }),
  helpfulVotes: many(reviewHelpful)
}))

export const reviewHelpfulRelations = relations(reviewHelpful, ({ one }) => ({
  review: one(reviews, {
    fields: [reviewHelpful.reviewId],
    references: [reviews.id]
  }),
  user: one(users, {
    fields: [reviewHelpful.userId],
    references: [users.id]
  })
}))

export const organizerProfilesRelations = relations(organizerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [organizerProfiles.userId],
    references: [users.id]
  })
}))

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id]
  })
}))

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id]
  }),
  category: one(blogCategories, {
    fields: [blogPosts.categoryId],
    references: [blogCategories.id]
  })
}))

export const blogCategoriesRelations = relations(blogCategories, ({ many }) => ({
  posts: many(blogPosts)
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id]
  })
}))

// Types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Retreat = typeof retreats.$inferSelect
export type NewRetreat = typeof retreats.$inferInsert
export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert
export type WishlistItem = typeof wishlist.$inferSelect
export type NewWishlistItem = typeof wishlist.$inferInsert
export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
export type RetreatCategory = typeof retreatCategories.$inferSelect
export type NewRetreatCategory = typeof retreatCategories.$inferInsert
export type ReviewHelpful = typeof reviewHelpful.$inferSelect
export type NewReviewHelpful = typeof reviewHelpful.$inferInsert
export type OrganizerProfile = typeof organizerProfiles.$inferSelect
export type NewOrganizerProfile = typeof organizerProfiles.$inferInsert
export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert
export type BlogPost = typeof blogPosts.$inferSelect
export type NewBlogPost = typeof blogPosts.$inferInsert
export type BlogCategory = typeof blogCategories.$inferSelect
export type NewBlogCategory = typeof blogCategories.$inferInsert
export type Coupon = typeof coupons.$inferSelect
export type NewCoupon = typeof coupons.$inferInsert
export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert
export type FAQ = typeof faqs.$inferSelect
export type NewFAQ = typeof faqs.$inferInsert
