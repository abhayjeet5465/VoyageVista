import User from "../models/User.js";
import { createClerkClient } from "@clerk/backend";

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    
    let user = await User.findById(userId);
    
    // If user doesn't exist in database, fetch from Clerk and create them
    if (!user) {
      try {
        // Check if Clerk Secret Key is set
        if (!process.env.CLERK_SECRET_KEY) {
          console.error("❌ CLERK_SECRET_KEY is not set in environment variables");
          return res.status(500).json({ success: false, message: "Server configuration error. Please contact support." });
        }

        // Initialize Clerk client with secret key
        const client = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
        
        // Fetch user info from Clerk
        const clerkUser = await client.users.getUser(userId);
        
        if (clerkUser) {
          // Create user in MongoDB with Clerk data
          // Extract email - try primary first, then first available
          let email = "no-email@example.com";
          if (clerkUser.emailAddresses && clerkUser.emailAddresses.length > 0) {
            const primaryEmail = clerkUser.emailAddresses.find(
              e => e.id === clerkUser.primaryEmailAddressId
            );
            email = primaryEmail?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress || email;
          }
          
          const firstName = clerkUser.firstName || "";
          const lastName = clerkUser.lastName || "";
          const username = `${firstName} ${lastName}`.trim() || clerkUser.username || "User";
          
          const userData = {
            _id: clerkUser.id,
            email: email,
            username: username,
            image: clerkUser.imageUrl || "",
            role: "user",
            recentSearchedCities: [],
          };
          
          user = await User.create(userData);
          console.log(`✅ Auto-created user in database: ${userData.username} (${userData.email})`);
        } else {
          return res.status(404).json({ success: false, message: "User not found in Clerk. Please try logging in again." });
        }
      } catch (clerkError) {
        console.error("Error fetching user from Clerk:", clerkError.message);
        return res.status(500).json({ success: false, message: "Failed to sync user account. Please try again later." });
      }
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ success: false, message: "Authentication failed" });
  }
};