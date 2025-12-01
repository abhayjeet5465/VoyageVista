import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import stripe from "stripe";
import mongoose from "mongoose";

// Function to Check Availablity of Room
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {

  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });

    const isAvailable = bookings.length === 0;
    return isAvailable;

  } catch (error) {
    console.error(error.message);
  }
};

// API to check availability of room
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    
    if (!room || !checkInDate || !checkOutDate) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    
    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
    res.status(200).json({ success: true, isAvailable });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ success: false, message: "Failed to check availability" });
  }
};

// API to create a new booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const { room, checkInDate, checkOutDate, guests } = req.body;

    // Validate required fields
    if (!room || !checkInDate || !checkOutDate || !guests) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    if (checkIn >= checkOut) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Check-out date must be after check-in date" });
    }

    if (checkIn < new Date()) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Check-in date cannot be in the past" });
    }

    const user = req.user._id;

    // Check availability within transaction to prevent race conditions
    const conflictingBookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    }).session(session);

    if (conflictingBookings.length > 0) {
      await session.abortTransaction();
      return res.status(409).json({ success: false, message: "Room is not available for selected dates" });
    }

    // Get totalPrice from Room
    const roomData = await Room.findById(room).populate("hotel").session(session);
    
    if (!roomData) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    
    let totalPrice = roomData.pricePerNight;

    // Calculate totalPrice based on nights
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= nights;

    // Create booking within transaction
    const booking = await Booking.create([{
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    }], { session });

    // Commit transaction
    await session.commitTransaction();

    // Send email after successful transaction (outside transaction)
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: req.user.email,
      subject: 'Hotel Booking Details',
      html: `
        <h2>Your Booking Details</h2>
        <p>Dear ${req.user.username},</p>
        <p>Thank you for your booking! Here are your details:</p>
        <ul>
          <li><strong>Booking ID:</strong> ${booking[0].id}</li>
          <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
          <li><strong>Location:</strong> ${roomData.hotel.address}</li>
          <li><strong>Check-in Date:</strong> ${booking[0].checkInDate.toDateString()}</li>
          <li><strong>Check-out Date:</strong> ${booking[0].checkOutDate.toDateString()}</li>
          <li><strong>Number of Nights:</strong> ${nights}</li>
          <li><strong>Total Amount:</strong> ${process.env.CURRENCY || '$'} ${booking[0].totalPrice}</li>
        </ul>
        <p>We look forward to welcoming you!</p>
        <p>If you need to make any changes, feel free to contact us.</p>
      `,
    };

    // Send email but don't fail the request if email fails
    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Booking still succeeded, just log the email error
    }

    res.status(201).json({ success: true, message: "Booking created successfully" });

  } catch (error) {
    await session.abortTransaction();
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: "Failed to create booking" });
  } finally {
    session.endSession();
  }
};

// API to get all bookings for a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = await Booking.find({ user }).populate("room hotel").sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
};


export const getHotelBookings = async (req, res) => {
  try {
    const { hotelId } = req.query;
    
    // If hotelId is provided, use it; otherwise get first hotel (backward compatibility)
    let hotel;
    if (hotelId) {
      hotel = await Hotel.findOne({ _id: hotelId, owner: req.auth.userId });
    } else {
      hotel = await Hotel.findOne({ owner: req.auth.userId });
    }
    
    if (!hotel) {
      return res.status(404).json({ success: false, message: "No Hotel found" });
    }
    const bookings = await Booking.find({ hotel: hotel._id }).populate("room hotel user").sort({ createdAt: -1 });
    // Total Bookings
    const totalBookings = bookings.length;
    // Total Revenue
    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

    res.status(200).json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } });
  } catch (error) {
    console.error('Error fetching hotel bookings:', error);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
};


export const stripePayment = async (req, res) => {
  try {

    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ success: false, message: "Booking ID is required" });
    }

    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.isPaid) {
      return res.status(400).json({ success: false, message: "Booking already paid" });
    }

    const roomData = await Room.findById(booking.room).populate("hotel");
    const totalPrice = booking.totalPrice;

    const { origin } = req.headers;

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    // Create Line Items for Stripe
    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: roomData.hotel.name,
          },
          unit_amount: totalPrice * 100,
        },
        quantity: 1,
      },
    ];

    // Create Checkout Session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/my-bookings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/my-bookings`,
      metadata: {
        bookingId,
      },
    });
    res.status(200).json({ success: true, url: session.url });

  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ success: false, message: "Payment processing failed" });
  }
}

// API to verify payment status
// GET /api/bookings/verify-payment/:sessionId
export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Session ID is required" });
    }

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    
    // Retrieve the session from Stripe
    const session = await stripeInstance.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // Get bookingId from metadata
    const { bookingId } = session.metadata;

    if (!bookingId) {
      return res.status(400).json({ success: false, message: "No booking ID in session" });
    }

    // Check if payment was successful
    if (session.payment_status === 'paid') {
      // Update booking status
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          isPaid: true,
          paymentMethod: 'Stripe',
          paidAt: new Date()
        },
        { new: true }
      );

      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      return res.status(200).json({ 
        success: true, 
        message: "Payment verified successfully",
        isPaid: true 
      });
    } else {
      return res.status(200).json({ 
        success: false, 
        message: "Payment not completed",
        isPaid: false 
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: "Failed to verify payment" });
  }
}