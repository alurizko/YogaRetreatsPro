import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertRetreatSchema, insertBookingSchema, insertRefundRequestSchema } from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Retreat routes
  app.get('/api/retreats', async (req, res) => {
    try {
      const retreats = await storage.getRetreats();
      res.json(retreats);
    } catch (error) {
      console.error("Error fetching retreats:", error);
      res.status(500).json({ message: "Failed to fetch retreats" });
    }
  });

  app.get('/api/retreats/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const retreat = await storage.getRetreat(id);
      if (!retreat) {
        return res.status(404).json({ message: "Retreat not found" });
      }
      res.json(retreat);
    } catch (error) {
      console.error("Error fetching retreat:", error);
      res.status(500).json({ message: "Failed to fetch retreat" });
    }
  });

  app.post('/api/retreats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'organizer') {
        return res.status(403).json({ message: "Only organizers can create retreats" });
      }

      const retreatData = insertRetreatSchema.parse({
        ...req.body,
        organizerId: userId,
      });

      const retreat = await storage.createRetreat(retreatData);
      res.status(201).json(retreat);
    } catch (error: any) {
      console.error("Error creating retreat:", error);
      res.status(400).json({ message: error.message || "Failed to create retreat" });
    }
  });

  app.get('/api/organizer/retreats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const retreats = await storage.getRetreatsByOrganizer(userId);
      res.json(retreats);
    } catch (error) {
      console.error("Error fetching organizer retreats:", error);
      res.status(500).json({ message: "Failed to fetch retreats" });
    }
  });

  // Booking routes
  app.get('/api/bookings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookings = await storage.getBookingsByParticipant(userId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get('/api/retreats/:id/bookings', isAuthenticated, async (req: any, res) => {
    try {
      const retreatId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if user is the organizer of this retreat
      const retreat = await storage.getRetreat(retreatId);
      if (!retreat || retreat.organizerId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const bookings = await storage.getBookingsByRetreat(retreatId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching retreat bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", isAuthenticated, async (req: any, res) => {
    try {
      const { retreatId, participants } = req.body;
      const userId = req.user.claims.sub;

      const retreat = await storage.getRetreat(retreatId);
      if (!retreat) {
        return res.status(404).json({ message: "Retreat not found" });
      }

      if (retreat.currentParticipants + participants > retreat.maxParticipants) {
        return res.status(400).json({ message: "Not enough spots available" });
      }

      const amount = parseFloat(retreat.price) * participants;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "eur",
        metadata: {
          retreatId: retreatId.toString(),
          participants: participants.toString(),
          userId: userId,
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post("/api/confirm-booking", isAuthenticated, async (req: any, res) => {
    try {
      const { paymentIntentId, retreatId, participants } = req.body;
      const userId = req.user.claims.sub;

      // Verify payment intent
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: "Payment not successful" });
      }

      const retreat = await storage.getRetreat(retreatId);
      if (!retreat) {
        return res.status(404).json({ message: "Retreat not found" });
      }

      const totalAmount = parseFloat(retreat.price) * participants;

      // Create booking
      const booking = await storage.createBooking({
        retreatId,
        participantId: userId,
        participants,
        totalAmount: totalAmount.toString(),
        stripePaymentIntentId: paymentIntentId,
        status: 'confirmed',
      });

      // Update retreat participant count
      await storage.updateRetreatParticipants(retreatId, participants);

      res.json(booking);
    } catch (error: any) {
      console.error("Error confirming booking:", error);
      res.status(500).json({ message: "Error confirming booking: " + error.message });
    }
  });

  // Refund routes
  app.post('/api/refund-requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { bookingId, reason } = req.body;

      const booking = await storage.getBooking(bookingId);
      if (!booking || booking.participantId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const refundRequest = await storage.createRefundRequest({
        bookingId,
        reason,
        status: 'pending',
      });

      res.status(201).json(refundRequest);
    } catch (error: any) {
      console.error("Error creating refund request:", error);
      res.status(400).json({ message: error.message || "Failed to create refund request" });
    }
  });

  app.post('/api/process-refund/:id', isAuthenticated, async (req: any, res) => {
    try {
      const refundRequestId = parseInt(req.params.id);
      const { approved, adminNotes } = req.body;
      const userId = req.user.claims.sub;

      const refundRequest = await storage.getRefundRequest(refundRequestId);
      if (!refundRequest) {
        return res.status(404).json({ message: "Refund request not found" });
      }

      const booking = await storage.getBooking(refundRequest.bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      const retreat = await storage.getRetreat(booking.retreatId);
      if (!retreat || retreat.organizerId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (approved) {
        // Process Stripe refund
        const refund = await stripe.refunds.create({
          payment_intent: booking.stripePaymentIntentId!,
          amount: Math.round(parseFloat(booking.totalAmount) * 100),
        });

        // Update booking status
        await storage.updateBooking(booking.id, {
          status: 'refunded',
          stripeRefundId: refund.id,
        });

        // Update refund request
        await storage.updateRefundRequest(refundRequestId, {
          status: 'processed',
          refundAmount: booking.totalAmount,
          adminNotes,
          processedDate: new Date(),
        });

        // Update retreat participant count
        await storage.updateRetreatParticipants(booking.retreatId, -booking.participants);
      } else {
        await storage.updateRefundRequest(refundRequestId, {
          status: 'denied',
          adminNotes,
          processedDate: new Date(),
        });
      }

      const updatedRequest = await storage.getRefundRequest(refundRequestId);
      res.json(updatedRequest);
    } catch (error: any) {
      console.error("Error processing refund:", error);
      res.status(500).json({ message: "Error processing refund: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
