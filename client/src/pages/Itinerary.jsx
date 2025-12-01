import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Itinerary() {
  const { state } = useLocation();
  const { id } = useParams();

  const [booking, setBooking] = useState(state?.booking || null);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");
  const [initializing, setInitializing] = useState(!state?.booking);

  // 1) If booking was NOT passed from MyBookings → fetch from backend
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`/api/bookings/${id}`);
        if (res.data.success) {
          setBooking({
            hotelName: res.data.booking.hotel.name,
            city: res.data.booking.hotel.address,
            checkIn: res.data.booking.checkInDate,
            checkOut: res.data.booking.checkOutDate,
            guests: res.data.booking.guests,
            roomType: res.data.booking.room.roomType,
          });
        }
      } catch (err) {
        console.error("Booking fetch error:", err);
      }
      setInitializing(false);
    };

    if (!state?.booking) {
      fetchBooking();
    } else {
      setInitializing(false);
    }
  }, [id, state]);

  // 2) Generate itinerary
  const generate = async () => {
    if (!booking) {
      setPlan("No booking data available.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/ai/itinerary", {
        hotelName: booking.hotelName,
        city: booking.city,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        roomType: booking.roomType,
      });

      setPlan(res.data.itinerary||"AI RETURNED NO DATA");
    } catch (err) {
      console.error("AI Error:", err);
      setPlan("Error generating itinerary.");
    }

    setLoading(false);
  };

  // 3) Emoji mapper
  const mapEmoji = (line) => {
    if (line.toLowerCase().includes("breakfast")) return "🍳 " + line;
    if (line.toLowerCase().includes("lunch")) return "🍽️ " + line;
    if (line.toLowerCase().includes("dinner")) return "🍷 " + line;
    if (line.toLowerCase().includes("visit")) return "🗺️ " + line;
    if (line.toLowerCase().includes("explore")) return "✨ " + line;
    if (line.toLowerCase().includes("market")) return "🛍️ " + line;
    if (line.toLowerCase().includes("lake")) return "🌅 " + line;
    return line;
  };

  // 4) Render AI result
  const renderDayCards = (text) => {
    if (!text) return null;

    const days = text.split(/Day [0-9]+:/g);
    const headers = text.match(/Day [0-9]+:/g) || [];

    return (
      <div className="mt-10 flex flex-col gap-10">
        {headers.map((header, i) => {
          const dayContent = days[i + 1]
            .trim()
            .split("\n")
            .filter((l) => l.trim() !== "");

          return (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all"
            >
              <div className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">
                {header}
              </div>

              <div className="relative pl-6">
                {dayContent.map((line, idx) => (
                  <div key={idx} className="relative mb-5">
                    <span className="absolute -left-6 top-1.5 h-3 w-3 bg-blue-500 rounded-full shadow"></span>
                    <p className="text-gray-700 leading-relaxed">
                      {mapEmoji(line.trim().replace("*", ""))}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 5) Still loading booking
  if (initializing) {
    return (
      <div className="py-40 text-center text-gray-600">
        Loading booking details…
      </div>
    );
  }

  // 6) UI
  return (
    <div className="py-28 px-4 md:px-16 lg:px-24 xl:px-32">
      <h1 className="text-3xl font-bold mb-4">AI Itinerary Assistant</h1>
      <p className="text-gray-600 mb-10">
        Your personalized travel planner based on your hotel booking.
      </p>

      {/* Booking Card */}
      <div className="border rounded-2xl shadow-sm p-8 bg-white">
        <h2 className="text-2xl font-semibold mb-2">{booking.hotelName}</h2>
        <p className="text-gray-500 mb-6">{booking.city}</p>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="border p-4 rounded-xl">
            <p className="font-semibold">Check-in</p>
            <p className="text-gray-600">
              {new Date(booking.checkIn).toDateString()}
            </p>
          </div>

          <div className="border p-4 rounded-xl">
            <p className="font-semibold">Check-out</p>
            <p className="text-gray-600">
              {new Date(booking.checkOut).toDateString()}
            </p>
          </div>

          <div className="border p-4 rounded-xl">
            <p className="font-semibold">Guests</p>
            <p className="text-gray-600">{booking.guests}</p>
          </div>

          <div className="border p-4 rounded-xl">
            <p className="font-semibold">Room</p>
            <p className="text-gray-600">{booking.roomType}</p>
          </div>

        </div>
      </div>

      {/* Button */}
      <div className="text-center mt-10">
        <button
          onClick={generate}
          disabled={loading}
          className="bg-blue-600 text-white px-10 py-4 rounded-lg font-medium shadow hover:bg-blue-700 transition-all"
        >
          {loading ? "⏳ Generating itinerary..." : "✨ Generate My Travel Plan"}
        </button>
      </div>

      {/* AI Plan */}
      {plan && <div className="mt-10">{renderDayCards(plan)}</div>}
    </div>
  );
}
