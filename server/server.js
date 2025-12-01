import express from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import connectCloudinary from "./configs/cloudinary.js";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";
import aiRouter from "./routes/aiRoutes.js";

connectDB();
connectCloudinary();

const app = express();

// ------------------ CORS FIRST ------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ------------------ PARSE BODY ------------------
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ------------------ AI ROUTES BEFORE CLERK (NO AUTH) ------------------
// 100% critical: Clerk must NOT interfere here
app.use("/api/ai", aiRouter);

// ------------------ SECURITY ------------------
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(morgan("dev"));

// ------------------ STRIPE RAW BODY ------------------
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// ------------------ CLERK AUTH ------------------
app.use(clerkMiddleware());

// ------------------ CLERK WEBHOOKS ------------------
app.use("/api/clerk", clerkWebhooks);

// ------------------ RATE LIMIT ------------------
app.use(
  "/api/",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// ------------------ AUTHENTICATED MAIN ROUTES ------------------
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

// ------------------ ROOT ------------------
app.get("/", (req, res) => res.send("API is working"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
