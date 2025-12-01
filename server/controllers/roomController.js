import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";

// API to create a new room for a hotel
// POST /api/rooms
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities, hotelId } = req.body;

    // Validate required fields
    if (!roomType || !pricePerNight || !amenities || !hotelId) {
      return res.status(400).json({ success: false, message: "All fields are required including hotel selection" });
    }

    // Validate price
    if (isNaN(pricePerNight) || +pricePerNight <= 0) {
      return res.status(400).json({ success: false, message: "Invalid price" });
    }

    // Verify the hotel belongs to this owner
    const hotel = await Hotel.findOne({ _id: hotelId, owner: req.auth.userId });

    if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found or you don't have permission" });

    // Validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required" });
    }

    // upload images to cloudinary
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });

    // Wait for all uploads to complete
    const images = await Promise.all(uploadImages);

    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });

    res.status(201).json({ success: true, message: "Room created successfully" });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ success: false, message: "Failed to create room" });
  }
};

// API to get all rooms
// GET /api/rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate({
        path: 'hotel',
        populate: {
          path: 'owner', 
          select: 'image',
        },
      }).sort({ createdAt: -1 });
    
    // Filter out rooms with null hotels (hotels that don't exist)
    const validRooms = rooms.filter(room => room.hotel !== null && room.hotel !== undefined);
    
    res.status(200).json({ success: true, rooms: validRooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ success: false, message: "Failed to fetch rooms" });
  }
};

// API to get all rooms for a specific hotel
// GET /api/rooms/owner
export const getOwnerRooms = async (req, res) => {
  try {
    const { hotelId } = req.query;
    
    // If hotelId is provided, use it; otherwise get first hotel (backward compatibility)
    let hotelData;
    if (hotelId) {
      hotelData = await Hotel.findOne({ _id: hotelId, owner: req.auth.userId });
    } else {
      hotelData = await Hotel.findOne({ owner: req.auth.userId });
    }
    
    if (!hotelData) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }
    
    const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate("hotel");
    res.status(200).json({ success: true, rooms });
  } catch (error) {
    console.error('Error fetching owner rooms:', error);
    res.status(500).json({ success: false, message: "Failed to fetch rooms" });
  }
};

// API to toggle availability of a room
// POST /api/rooms/toggle-availability
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    
    if (!roomId) {
      return res.status(400).json({ success: false, message: "Room ID is required" });
    }
    
    const roomData = await Room.findById(roomId);
    
    if (!roomData) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    
    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();
    res.status(200).json({ success: true, message: "Room availability updated" });
  } catch (error) {
    console.error('Error toggling room availability:', error);
    res.status(500).json({ success: false, message: "Failed to update room availability" });
  }
};