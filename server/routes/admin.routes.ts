import express from "express";
import { 
    getAdminStats, 
    getAdminHostels, 
    adminToggleHostelStatus, 
    getPendingRequests, 
    handleManagerRequest,
    getAdminUsers
} from "../controllers/admin.controller";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth";

const adminRouter = express.Router();

// All routes require admin role
adminRouter.use(isAuthenticated, authorizeRoles("admin"));

// Stats
adminRouter.get("/stats", getAdminStats);

// Hostels
adminRouter.get("/hostels", getAdminHostels);
adminRouter.put("/toggle-hostel", adminToggleHostelStatus);

// Users
adminRouter.get("/users", getAdminUsers);

// Manager requests
adminRouter.get("/pending-requests", getPendingRequests);
adminRouter.put("/handle-request", handleManagerRequest);

export default adminRouter;
