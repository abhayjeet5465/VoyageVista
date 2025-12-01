import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { ownerOnly } from '../middleware/roleMiddleware.js';
import { 
    checkAvailabilityAPI, 
    createBooking, 
    getHotelBookings, 
    getUserBookings, 
    stripePayment, 
    verifyPayment 
} from '../controllers/bookingController.js';

import Booking from "../models/Booking.js";   // ✅ CORRECT IMPORT

const bookingRouter = express.Router();


bookingRouter.post('/check-availability', checkAvailabilityAPI);
bookingRouter.post('/book', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/hotel', protect, ownerOnly, getHotelBookings);
bookingRouter.post('/stripe-payment', protect, stripePayment);
bookingRouter.get('/verify-payment/:sessionId', protect, verifyPayment);

// ✅ ADD THIS ROUTE
bookingRouter.get('/:id', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("hotel")
            .populate("room");

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        res.json({ success: true, booking });

    } catch (err) {
        console.error("Booking fetch error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default bookingRouter;
