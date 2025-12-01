import express from "express";
import axios from "axios";

const router = express.Router();
if (!process.env.HF_TOKEN) {
  console.error("❌ ERROR: HF_TOKEN missing from environment!");
}


router.post("/itinerary", async (req, res) => {
  try {
    const { hotelName, city, checkIn, checkOut, guests, roomType } = req.body;

    // Calculate number of days
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const numberOfDays = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    const prompt = `Create a detailed ${numberOfDays}-day travel itinerary for ${city}.

REQUIREMENTS:
- Generate EXACTLY ${numberOfDays} ${numberOfDays === 1 ? 'day' : 'days'} (Day 1 to Day ${numberOfDays})
- Include 5-7 activities per day with specific time slots
- if ${numberOfDays}>3, then give shorter replies/3-5 lines per day 
- Each activity must have a time (e.g., 9:00 AM, 2:00 PM, 6:00 PM)
- Include famous landmarks, attractions, restaurants, and cultural experiences in ${city}
- Activities should be realistic and properly spaced throughout the day
- Brief descriptions for each activity (1 line maximum)
FORMAT:
Day 1:
🏛️ - Visit [Landmark] at [Time]
✨ - Explore [Attraction] at [Time]
🍽️ - Lunch/Dinner at [Restaurant] at [Time]
and more
Booking Details:
Hotel: ${hotelName}
Location: ${city}
Duration: ${checkIn} to ${checkOut}
Guests: ${guests}
Room Type: ${roomType}
Generate the itinerary now.`;

    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "meta-llama/Llama-3.2-1B-Instruct:novita",  
        messages: [
          { role: "system", content: "You are an expert travel planner who creates detailed day-by-day itineraries with specific times and activities." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.8
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    const message = response.data.choices[0].message.content;
    res.json({ itinerary: message });

  } catch (err) {
    console.error("AI ROUTE ERROR:", err.response?.data || err);
    res.status(500).json({ error: "AI request failed", raw: err.response?.data });
  }
});

export default router;
