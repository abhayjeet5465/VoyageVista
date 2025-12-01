import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("✅ Database Connected Successfully");
        });
        
        mongoose.connection.on('error', (err) => {
            console.error("❌ Database Connection Error:", err.message);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.warn("⚠️ Database Disconnected");
        });

        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error("❌ MONGODB_URI environment variable is not set!");
            return;
        }

        // Use dbName option instead of concatenating to the URI to avoid
        // corrupting query params like w=majority
        const dbName = process.env.MONGODB_DB || 'hotel-booking';

        console.log("🔄 Connecting to MongoDB...", { dbName });
        await mongoose.connect(uri, { dbName });
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error.message);
        console.error("Please check your MONGODB_URI and MONGODB_DB in the .env file");
    }
};

export default connectDB;
// Note: Do not use the '@' symbol in your database user's password.