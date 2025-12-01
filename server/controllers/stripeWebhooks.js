import stripe from "stripe";
import Booking from "../models/Booking.js";

// API to handle Stripe Webhooks
// POST /api/stripe
export const stripeWebhooks = async (request, response) => {
  // Stripe Gateway Initialize
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { bookingId } = session.metadata;

    if (!bookingId) {
      console.error('No bookingId in session metadata');
      return response.status(400).json({ error: 'No bookingId found' });
    }

    try {
      // Mark Payment as Paid
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId, 
        { 
          isPaid: true, 
          paymentMethod: "Stripe",
          paidAt: new Date()
        },
        { new: true }
      );

      if (!updatedBooking) {
        console.error(`Booking ${bookingId} not found`);
        return response.status(404).json({ error: 'Booking not found' });
      }

      console.log(`Payment successful for booking ${bookingId}`);
    } catch (error) {
      console.error('Error updating booking:', error);
      return response.status(500).json({ error: 'Failed to update booking' });
    }
  } else if (event.type === "payment_intent.succeeded") {
    // Also handle payment_intent.succeeded as backup
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    try {
      // Getting Session Metadata
      const sessions = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      if (sessions.data.length > 0) {
        const { bookingId } = sessions.data[0].metadata;

        if (bookingId) {
          await Booking.findByIdAndUpdate(
            bookingId, 
            { 
              isPaid: true, 
              paymentMethod: "Stripe",
              paidAt: new Date()
            }
          );
          console.log(`Payment successful for booking ${bookingId}`);
        }
      }
    } catch (error) {
      console.error('Error processing payment_intent.succeeded:', error);
    }
  } else {
    console.log("Unhandled event type:", event.type);
  }

  response.json({ received: true });
};
