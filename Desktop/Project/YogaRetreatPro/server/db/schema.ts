import { pgTable, serial, varchar, text, integer, decimal, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  avatar: varchar('avatar', { length: 500 }),
  role: varchar('role', { length: 20 }).notNull().default('user'), // 'user', 'admin', 'organizer'
  isVerified: boolean('is_verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// Retreats table
export const retreats = pgTable('retreats', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  shortDescription: varchar('short_description', { length: 500 }),
  location: varchar('location', { length: 255 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  address: text('address'),
  coordinates: jsonb('coordinates'), // { lat: number, lng: number }
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  duration: integer('duration').notNull(), // days
  maxParticipants: integer('max_participants').notNull(),
  currentParticipants: integer('current_participants').notNull().default(0),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  images: jsonb('images'), // array of image URLs
  amenities: jsonb('amenities'), // array of amenity strings
  included: jsonb('included'), // array of included items
  notIncluded: jsonb('not_included'), // array of not included items
  difficulty: varchar('difficulty', { length: 20 }).notNull(), // 'beginner', 'intermediate', 'advanced'
  yogaStyles: jsonb('yoga_styles'), // array of yoga style strings
  organizer: varchar('organizer', { length: 255 }).notNull(),
  organizerId: integer('organizer_id').references(() => users.id),
  isActive: boolean('is_active').notNull().default(true),
  isFeatured: boolean('is_featured').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// Bookings table
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  retreatId: integer('retreat_id').notNull().references(() => retreats.id),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending', 'confirmed', 'cancelled', 'completed'
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  paymentStatus: varchar('payment_status', { length: 20 }).notNull().default('pending'), // 'pending', 'paid', 'refunded'
  paymentMethod: varchar('payment_method', { length: 50 }),
  specialRequests: text('special_requests'),
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
  rating: integer('rating').notNull(), // 1-5
  title: varchar('title', { length: 255 }),
  comment: text('comment'),
  isVerified: boolean('is_verified').notNull().default(false), // verified purchase
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  wishlist: many(wishlist),
  reviews: many(reviews),
  organizedRetreats: many(retreats)
}))

export const retreatsRelations = relations(retreats, ({ one, many }) => ({
  organizer: one(users, {
    fields: [retreats.organizerId],
    references: [users.id]
  }),
  bookings: many(bookings),
  wishlist: many(wishlist),
  reviews: many(reviews)
}))

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id]
  }),
  retreat: one(retreats, {
    fields: [bookings.retreatId],
    references: [retreats.id]
  })
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

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id]
  }),
  retreat: one(retreats, {
    fields: [reviews.retreatId],
    references: [retreats.id]
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
