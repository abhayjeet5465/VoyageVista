import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const { axios, getToken, user } = useAppContext();
  const [bookings, setBookings] = useState([]);

  // Fetch bookings
  const fetchUserBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to fetch bookings");
    }
  };

  // Stripe payment
  const handlePayment = async (bookingId) => {
    try {
      const { data } = await axios.post(
        "/api/bookings/stripe-payment",
        { bookingId },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        window.location.href = data.url;
      }
    } catch {
      toast.error("Payment initiation failed");
    }
  };

  // Cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const { data } = await axios.patch(
        `/api/bookings/${bookingId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success("Booking cancelled");

        // Update local state
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, isCancelled: true } : b
          )
        );
      }
    } catch {
      toast.error("Cancellation failed");
    }
  };

  // Verify Stripe payment
  const verifyPayment = async (sessionId) => {
    try {
      const { data } = await axios.get(
        `/api/bookings/verify-payment/${sessionId}`,
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success && data.isPaid) {
        toast.success("Payment successful");
        window.history.replaceState({}, document.title, "/my-bookings");
        fetchUserBookings();
      }
    } catch {
      toast.error("Payment verification failed");
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchUserBookings();

    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    if (sessionId) verifyPayment(sessionId);
  }, [user]);

  return (
    <div className="py-28 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Bookings"
        subTitle="Manage your past, current, and upcoming hotel reservations"
        align="left"
      />

      <div className="max-w-6xl mt-8 text-gray-800">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] border-b py-3 font-medium">
          <div>Hotels</div>
          <div>Date & Timings</div>
          <div>Payment</div>
        </div>

        {bookings.map((booking) => {
          const isCancelled = booking.isCancelled === true;
          const isPaid = booking.isPaid === true;

          return (
            <div
              key={booking._id}
              className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] border-b py-6"
            >
              {/* HOTEL */}
              <div className="flex flex-col md:flex-row">
                <img
                  src={booking.room.images[0]}
                  alt="hotel"
                  className="md:w-44 rounded shadow object-cover"
                />

                <div className="md:ml-4 mt-3 md:mt-0 space-y-1">
                  <p className="font-playfair text-2xl">
                    {booking.hotel.name}
                    <span className="text-sm">
                      {" "}
                      ({booking.room.roomType})
                    </span>
                  </p>

                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <img src={assets.locationIcon} alt="" />
                    {booking.hotel.address}
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <img src={assets.guestsIcon} alt="" />
                    Guests: {booking.guests}
                  </div>

                  <p>Total: ${booking.totalPrice}</p>
                </div>
              </div>

              {/* DATES */}
              <div className="flex gap-8 md:items-center mt-4 md:mt-0">
                <div>
                  <p>Check-In:</p>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.checkInDate).toDateString()}
                  </p>
                </div>
                <div>
                  <p>Check-Out:</p>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.checkOutDate).toDateString()}
                  </p>
                </div>
              </div>

              {/* STATUS + ACTIONS */}
              <div className="flex flex-col items-start justify-center mt-4 md:mt-0">
                {/* STATUS */}
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      isCancelled
                        ? "bg-gray-400"
                        : isPaid
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      isCancelled
                        ? "text-gray-400"
                        : isPaid
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {isCancelled ? "Cancelled" : isPaid ? "Paid" : "Unpaid"}
                  </p>
                </div>

                {/* PAY */}
                {!isCancelled && !isPaid && (
                  <button
                    onClick={() => handlePayment(booking._id)}
                    className="mt-3 w-full max-w-[200px] px-4 py-1.5 text-xs border rounded-full hover:bg-gray-50"
                  >
                    Pay Now
                  </button>
                )}

                {/* CANCEL */}
                {!isCancelled &&
                  new Date(booking.checkInDate) > new Date() && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="mt-2 w-full max-w-[200px] px-4 py-1.5 text-xs border border-red-400 text-red-500 rounded-full hover:bg-red-50"
                    >
                      Cancel Booking
                    </button>
                  )}

                {/* AI ITINERARY */}
                {!isCancelled && (
                  <Link
                    to={`/itinerary/${booking._id}`}
                    state={{
                      booking: {
                        hotelName: booking.hotel.name,
                        city: booking.hotel.address,
                        checkIn: booking.checkInDate,
                        checkOut: booking.checkOutDate,
                        guests: booking.guests,
                        roomType: booking.room.roomType,
                      },
                    }}
                    className="mt-3 w-full max-w-[200px] text-center bg-purple-600 text-white px-5 py-2 rounded-full text-sm hover:bg-purple-700"
                  >
                    AI Itinerary
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};``

export default MyBookings;
