import express from "express";
import { 
    getAdminStats, 
    getAdminHostels, 
    adminToggleHostelStatus,
    toggleFeaturedHostel,
    getFeaturedHostels,
    getPendingRequests, 
    handleManagerRequest,
    getAdminUsers,
    getAllReviews,
    deleteReview,
    getAllQuestions,
    deleteQuestion,
    createAnnouncement,
    getAnnouncements,
    getActiveAnnouncements,
    toggleAnnouncement,
    toggleAnnouncement,
    deleteAnnouncement,
    updateUserRole,
    updateUserStatus
} from "../controllers/admin.controller";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth";

const adminRouter = express.Router();

// Public routes
adminRouter.get("/featured-hostels", getFeaturedHostels);
adminRouter.get("/active-announcements", getActiveAnnouncements);

// Protected admin routes
adminRouter.use(isAuthenticated, authorizeRoles("admin"));

// Stats
adminRouter.get("/stats", getAdminStats);

// Hostels
adminRouter.get("/hostels", getAdminHostels);
adminRouter.put("/toggle-hostel", adminToggleHostelStatus);
adminRouter.put("/toggle-featured", toggleFeaturedHostel);

// Users
adminRouter.get("/users", getAdminUsers);
adminRouter.put("/update-user-role", updateUserRole);
adminRouter.put("/update-user-status", updateUserStatus);

// Manager requests
adminRouter.get("/pending-requests", getPendingRequests);
adminRouter.put("/handle-request", handleManagerRequest);

// Moderation
adminRouter.get("/reviews", getAllReviews);
adminRouter.delete("/review/:reviewId", deleteReview);
adminRouter.get("/questions", getAllQuestions);
adminRouter.delete("/question/:questionId", deleteQuestion);

// Announcements
adminRouter.post("/announcement", createAnnouncement);
adminRouter.get("/announcements", getAnnouncements);
adminRouter.put("/toggle-announcement", toggleAnnouncement);
adminRouter.delete("/announcement/:announcementId", deleteAnnouncement);

export default adminRouter;
