import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { ownerOnly } from "../middleware/roleMiddleware.js";
import { registerHotel, getOwnerHotels } from "../controllers/hotelController.js";

const hotelRouter = express.Router();

// Require hotelOwner role to register/manage hotel
hotelRouter.post("/", protect, ownerOnly, registerHotel);
hotelRouter.get("/owner", protect, ownerOnly, getOwnerHotels);

export default hotelRouter;
