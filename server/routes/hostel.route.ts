
import express from "express";
import { createHostel, deleteHostel, getAllHostels, updateHostel, getMyHostel, getHostelById, toggleHostelStatus } from "../controllers/hostel.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";

const hostelRouter = express.Router();

hostelRouter.get("/hostels", getAllHostels);
hostelRouter.get("/hostel/:id", getHostelById);
hostelRouter.get("/get-my-hostel", isAuthenticated, authorizeRoles("manager", "admin"), getMyHostel);

hostelRouter.post(
    "/create-hostel", 
    isAuthenticated, 
    authorizeRoles("manager", "admin"), 
    createHostel
);

hostelRouter.put(
    "/update-hostel/:id",
    isAuthenticated,
    authorizeRoles("manager", "admin"),
    updateHostel
);

hostelRouter.put(
    "/toggle-hostel-status",
    isAuthenticated,
    authorizeRoles("manager", "admin"),
    toggleHostelStatus
);

hostelRouter.delete(
    "/delete-hostel/:id",
    isAuthenticated,
    authorizeRoles("manager", "admin"), 
    deleteHostel
);

export default hostelRouter;