import express from "express";
import { createRoom, getHostelRooms, updateRoom, deleteRoom, toggleRoomAvailability } from "../controllers/room.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";

const roomRouter = express.Router();

roomRouter.get("/hostel-rooms/:hostelId", getHostelRooms);

roomRouter.post(
    "/create-room", 
    isAuthenticated, 
    authorizeRoles("manager", "admin"), 
    createRoom
);

roomRouter.put(
    "/update-room/:id",
    isAuthenticated,
    authorizeRoles("manager", "admin"),
    updateRoom
);

roomRouter.delete(
    "/delete-room/:id",
    isAuthenticated,
    authorizeRoles("manager", "admin"),
    deleteRoom
);

roomRouter.put(
    "/toggle-availability/:id",
    isAuthenticated,
    authorizeRoles("manager", "admin"),
    toggleRoomAvailability
);

export default roomRouter;