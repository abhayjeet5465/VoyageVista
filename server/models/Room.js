import mongoose from "mongoose";
const { Schema } = mongoose;

const roomSchema = new Schema(
  {
    hotel: { type: String, ref: "Hotel", required: true },
    roomType: { type: String, required: true }, // "Single", "Double"
    pricePerNight: { type: Number, required: true },
    amenities: { type: Array, required: true },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Add indexes for better query performance
roomSchema.index({ hotel: 1, isAvailable: 1 }); // Compound index for hotel rooms filtering
roomSchema.index({ pricePerNight: 1 }); // For price-based sorting

const Room = mongoose.model("Room", roomSchema);

export default Room;
