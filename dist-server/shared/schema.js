import { pgTable, text, varchar, timestamp, jsonb, index, serial, integer, decimal, boolean, date, } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
// Session storage table (mandatory for Replit Auth)
export var sessions = pgTable("sessions", {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
}, function (table) { return [index("IDX_session_expire").on(table.expire)]; });
// User storage table (mandatory for Replit Auth)
export var users = pgTable("users", {
    id: varchar("id").primaryKey().notNull(),
    email: varchar("email").unique(),
    firstName: varchar("first_name"),
    lastName: varchar("last_name"),
    profileImageUrl: varchar("profile_image_url"),
    role: varchar("role").notNull().default("participant"), // 'participant' | 'organizer'
    password_hash: varchar("password_hash"),
    stripeCustomerId: varchar("stripe_customer_id"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Retreats table
export var retreats = pgTable("retreats", {
    id: serial("id").primaryKey(),
    title: varchar("title").notNull(),
    description: text("description").notNull(),
    location: varchar("location").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    maxParticipants: integer("max_participants").notNull(),
    currentParticipants: integer("current_participants").notNull().default(0),
    organizerId: varchar("organizer_id").notNull().references(function () { return users.id; }),
    imageUrl: varchar("image_url"),
    isActive: boolean("is_active").notNull().default(true),
    cancellationPolicy: text("cancellation_policy"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Bookings table
export var bookings = pgTable("bookings", {
    id: serial("id").primaryKey(),
    retreatId: integer("retreat_id").notNull().references(function () { return retreats.id; }),
    participant_id: varchar("participant_id").notNull().references(function () { return users.id; }),
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
export var refundRequests = pgTable("refund_requests", {
    id: serial("id").primaryKey(),
    bookingId: integer("booking_id").notNull().references(function () { return bookings.id; }),
    reason: text("reason").notNull(),
    status: varchar("status").notNull().default("pending"), // 'pending' | 'approved' | 'denied' | 'processed'
    refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
    adminNotes: text("admin_notes"),
    requestDate: timestamp("request_date").defaultNow(),
    processedDate: timestamp("processed_date"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Instructors table
export var instructors = pgTable("instructors", {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name").notNull(),
    lastName: varchar("last_name").notNull(),
    bio: text("bio"),
    photoUrl: varchar("photo_url"),
});
// Retreat-Instructors join table
export var retreat_instructors = pgTable("retreat_instructors", {
    id: serial("id").primaryKey(),
    retreat_id: integer("retreat_id").notNull().references(function () { return retreats.id; }),
    instructor_id: integer("instructor_id").notNull().references(function () { return instructors.id; }),
});
// Reviews table
export var reviews = pgTable("reviews", {
    id: serial("id").primaryKey(),
    user_id: varchar("user_id").notNull().references(function () { return users.id; }),
    retreat_id: integer("retreat_id").notNull().references(function () { return retreats.id; }),
    rating: integer("rating").notNull(),
    comment: text("comment"),
});
// Blog posts table
export var blog_posts = pgTable("blog_posts", {
    id: serial("id").primaryKey(),
    author_id: varchar("author_id").notNull().references(function () { return users.id; }),
    title: varchar("title").notNull(),
    content: text("content").notNull(),
});
// Zod schemas
export var insertUserSchema = createInsertSchema(users).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export var insertRetreatSchema = createInsertSchema(retreats).omit({
    id: true,
    currentParticipants: true,
    createdAt: true,
    updatedAt: true,
});
export var insertBookingSchema = createInsertSchema(bookings).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export var insertRefundRequestSchema = createInsertSchema(refundRequests).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
