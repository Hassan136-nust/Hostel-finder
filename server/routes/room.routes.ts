import express from "express";
import { createRoom, getHostelRooms } from "../controllers/room.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";

const roomRouter = express.Router();

roomRouter.get("/hostel-rooms/:hostelId", getHostelRooms);

roomRouter.post(
    "/create-room", 
    isAuthenticated, 
    authorizeRoles("manager", "admin"), 
    createRoom
);

export default roomRouter;