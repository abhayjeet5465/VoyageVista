
import { createClerkClient } from "@clerk/backend";

// Get User data using Token (JWT)
// GET /api/user/
export const getUserData = async (req, res) => {
  try {
    const role = req.user.role;
    const recentSearchedCities = req.user.recentSearchedCities;
    res.status(200).json({ success: true, role, recentSearchedCities });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user data' });
  }
};

// Store User Recent Searched Cities
// POST /api/user/recent-searched-cities
export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { recentSearchedCity } = req.body;
    
    if (!recentSearchedCity) {
      return res.status(400).json({ success: false, message: "City name is required" });
    }
    
    const user = await req.user;
    // Store max 3 recent searched cities
    if (user.recentSearchedCities.length < 3) {
      user.recentSearchedCities.push(recentSearchedCity);
    } else {
      user.recentSearchedCities.shift();
      user.recentSearchedCities.push(recentSearchedCity);
    }
    await user.save();
    res.status(200).json({ success: true, message: "City added" });
  } catch (error) {
    console.error('Error storing searched city:', error);
    res.status(500).json({ success: false, message: "Failed to store searched city" });
  }
};

// Update User Role (user | hotelOwner)
// POST /api/user/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !["user", "hotelOwner"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = req.user; // from protect middleware

    // Update in MongoDB
    user.role = role;
    await user.save();

    // Also sync to Clerk public metadata (optional)
    if (!process.env.CLERK_SECRET_KEY) {
      console.warn("CLERK_SECRET_KEY not set; skipping Clerk metadata sync");
    } else {
      try {
        const client = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
        await client.users.updateUser(user._id, {
          publicMetadata: { role },
        });
      } catch (e) {
        console.warn("Failed to sync role to Clerk publicMetadata:", e.message);
      }
    }

    res.status(200).json({ success: true, message: "Role updated", role });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ success: false, message: "Failed to update role" });
  }
};