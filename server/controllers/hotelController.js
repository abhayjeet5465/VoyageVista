import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

// API to create a new hotel
// POST /api/hotels
export const registerHotel = async (req, res) => {
  try {
    // Check if user exists (should be set by protect middleware)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "User not authenticated or user not found in database" });
    }

    const { name, address, contact, city } = req.body;
    const owner = req.user._id;

    // Validate required fields
    if (!name || !address || !contact || !city) {
      return res.status(400).json({ success: false, message: "Please provide all required fields: name, address, contact, and city" });
    }

    // Validate field lengths and formats
    if (name.trim().length < 3 || name.trim().length > 100) {
      return res.status(400).json({ success: false, message: "Hotel name must be between 3 and 100 characters" });
    }

    // Basic phone validation: allows digits, spaces, dashes, parentheses, optional leading +
    const phone = contact.trim();
    const phoneRegex = /^[+]?[-()\s\d]{7,20}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: "Invalid phone format. Use digits, spaces, dashes, parentheses, optional +" });
    }

    // Create hotel in MongoDB (removed single hotel restriction)
    const newHotel = await Hotel.create({ name, address, contact, city, owner });

    // Update User Role
    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.status(201).json({ success: true, message: "Hotel Registered Successfully", hotel: newHotel });
  } catch (error) {
    console.error("Hotel registration error:", error);
    res.status(500).json({ success: false, message: "Failed to register hotel" });
  }
};

// API to get all hotels for the logged-in owner
// GET /api/hotels/owner
export const getOwnerHotels = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const hotels = await Hotel.find({ owner: req.user._id }).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, hotels });
  } catch (error) {
    console.error("Error fetching owner hotels:", error);
    res.status(500).json({ success: false, message: "Failed to fetch hotels" });
  }
};