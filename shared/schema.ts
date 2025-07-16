import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("participant"), // 'participant' | 'organizer'
  stripeCustomerId: varchar("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Retreats table
export const retreats = pgTable("retreats", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  location: varchar("location").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  maxParticipants: integer("max_participants").notNull(),
  currentParticipants: integer("current_participants").notNull().default(0),
  organizerId: varchar("organizer_id").notNull().references(() => users.id),
  imageUrl: varchar("image_url"),
  isActive: boolean("is_active").notNull().default(true),
  cancellationPolicy: text("cancellation_policy"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  retreatId: integer("retreat_id").notNull().references(() => retreats.id),
  participant_id: varchar("participant_id").notNull().references(() => users.id),
  participants: integer("participants").notNull().default(1),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status").notNull().default("confirmed"), // 'pending' | 'confirmed' | 'cancelled' | 'refunded'
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  stripeRefundId: varchar("stripe_refund_id"),
  bookingDate: timestamp("booking_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Refund requests table
export const refundRequests = pgTable("refund_requests", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  reason: text("reason").notNull(),
  status: varchar("status").notNull().default("pending"), // 'pending' | 'approved' | 'denied' | 'processed'
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
  adminNotes: text("admin_notes"),
  requestDate: timestamp("request_date").defaultNow(),
  processedDate: timestamp("processed_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertRetreat = typeof retreats.$inferInsert;
export type Retreat = typeof retreats.$inferSelect;

export type InsertBooking = typeof bookings.$inferInsert;
export type Booking = typeof bookings.$inferSelect;

export type InsertRefundRequest = typeof refundRequests.$inferInsert;
export type RefundRequest = typeof refundRequests.$inferSelect;

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRetreatSchema = createInsertSchema(retreats).omit({
  id: true,
  currentParticipants: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRefundRequestSchema = createInsertSchema(refundRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
// обновление для нового коммита