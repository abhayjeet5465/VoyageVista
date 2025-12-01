import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { ownerOnly } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { createRoom, getRooms, toggleRoomAvailability, getOwnerRooms, } from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post("/", upload.array("images", 5), protect, ownerOnly, createRoom);
roomRouter.get("/", getRooms);
roomRouter.get("/owner", protect, ownerOnly, getOwnerRooms);
roomRouter.post("/toggle-availability", protect, ownerOnly, toggleRoomAvailability);

export default roomRouter;
