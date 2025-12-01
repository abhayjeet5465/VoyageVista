import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    role: { type: String, enum: ["user", "hotelOwner"], default: "user", },
    recentSearchedCities: [{ type: String, required: true }],
  }, { timestamps: true }
);

// Add indexes for better query performance
userSchema.index({ email: 1 }); // For email lookups
userSchema.index({ role: 1 }); // For role-based queries

const User = mongoose.model("User", userSchema);

export default User;