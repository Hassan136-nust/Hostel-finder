
import express from "express";
import { createHostel, getAllHostels } from "../controllers/hostel.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";

const hostelRouter = express.Router();

hostelRouter.get("/hostels", getAllHostels);

hostelRouter.post(
    "/create-hostel", 
    isAuthenticated, 
    authorizeRoles("manager", "admin"), 
    createHostel
);

export default hostelRouter;