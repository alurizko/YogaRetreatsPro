import {
  users,
  retreats,
  bookings,
  refundRequests,
  type User,
  type UpsertUser,
  type Retreat,
  type InsertRetreat,
  type Booking,
  type InsertBooking,
  type RefundRequest,
  type InsertRefundRequest,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Retreat operations
  createRetreat(retreat: InsertRetreat): Promise<Retreat>;
  getRetreat(id: number): Promise<Retreat | undefined>;
  getRetreats(): Promise<Retreat[]>;
  getRetreatsByOrganizer(organizerId: string): Promise<Retreat[]>;
  updateRetreat(id: number, updates: Partial<InsertRetreat>): Promise<Retreat>;
  deleteRetreat(id: number): Promise<void>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByParticipant(participantId: string): Promise<Booking[]>;
  getBookingsByRetreat(retreatId: number): Promise<Booking[]>;
  updateBooking(id: number, updates: Partial<InsertBooking>): Promise<Booking>;
  updateRetreatParticipants(retreatId: number, increment: number): Promise<void>;
  
  // Refund operations
  createRefundRequest(request: InsertRefundRequest): Promise<RefundRequest>;
  getRefundRequest(id: number): Promise<RefundRequest | undefined>;
  getRefundRequestsByBooking(bookingId: number): Promise<RefundRequest[]>;
  updateRefundRequest(id: number, updates: Partial<InsertRefundRequest>): Promise<RefundRequest>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Retreat operations
  async createRetreat(retreat: InsertRetreat): Promise<Retreat> {
    const [newRetreat] = await db.insert(retreats).values(retreat).returning();
    return newRetreat;
  }

  async getRetreat(id: number): Promise<Retreat | undefined> {
    const [retreat] = await db.select().from(retreats).where(eq(retreats.id, id));
    return retreat;
  }

  async getRetreats(): Promise<Retreat[]> {
    return await db
      .select()
      .from(retreats)
      .where(eq(retreats.isActive, true))
      .orderBy(desc(retreats.startDate));
  }

  async getRetreatsByOrganizer(organizerId: string): Promise<Retreat[]> {
    return await db
      .select()
      .from(retreats)
      .where(eq(retreats.organizerId, organizerId))
      .orderBy(desc(retreats.createdAt));
  }

  async updateRetreat(id: number, updates: Partial<InsertRetreat>): Promise<Retreat> {
    const [updatedRetreat] = await db
      .update(retreats)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(retreats.id, id))
      .returning();
    return updatedRetreat;
  }

  async deleteRetreat(id: number): Promise<void> {
    await db.update(retreats).set({ isActive: false }).where(eq(retreats.id, id));
  }

  // Booking operations
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async getBookingsByParticipant(participantId: string): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.participantId, participantId))
      .orderBy(desc(bookings.createdAt));
  }

  async getBookingsByRetreat(retreatId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.retreatId, retreatId))
      .orderBy(desc(bookings.createdAt));
  }

  async updateBooking(id: number, updates: Partial<InsertBooking>): Promise<Booking> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking;
  }

  async updateRetreatParticipants(retreatId: number, increment: number): Promise<void> {
    await db
      .update(retreats)
      .set({ 
        currentParticipants: db.$increment(retreats.currentParticipants, increment),
        updatedAt: new Date()
      })
      .where(eq(retreats.id, retreatId));
  }

  // Refund operations
  async createRefundRequest(request: InsertRefundRequest): Promise<RefundRequest> {
    const [newRequest] = await db.insert(refundRequests).values(request).returning();
    return newRequest;
  }

  async getRefundRequest(id: number): Promise<RefundRequest | undefined> {
    const [request] = await db.select().from(refundRequests).where(eq(refundRequests.id, id));
    return request;
  }

  async getRefundRequestsByBooking(bookingId: number): Promise<RefundRequest[]> {
    return await db
      .select()
      .from(refundRequests)
      .where(eq(refundRequests.bookingId, bookingId))
      .orderBy(desc(refundRequests.createdAt));
  }

  async updateRefundRequest(id: number, updates: Partial<InsertRefundRequest>): Promise<RefundRequest> {
    const [updatedRequest] = await db
      .update(refundRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(refundRequests.id, id))
      .returning();
    return updatedRequest;
  }
}

export const storage = new DatabaseStorage();
