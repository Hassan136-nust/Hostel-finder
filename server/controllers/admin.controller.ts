import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middlewares/CatchAsyncErrorMiddleware";
import ErrorHandler from "../utils/ErrorHandler";
import userModel from "../models/user.model";
import hostelModel from "../models/hostel.model";
import roomModel from "../models/room.model";
import reviewModel from "../models/review.model";
import questionModel from "../models/question.model";
import announcementModel from "../models/announcement.model";

// Get admin dashboard stats
export const getAdminStats = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalUsers = await userModel.countDocuments();
        const totalManagers = await userModel.countDocuments({ role: "manager" });
        const totalHostels = await hostelModel.countDocuments();
        const activeHostels = await hostelModel.countDocuments({ isActive: { $ne: false } });
        const totalRooms = await roomModel.countDocuments();
        const totalReviews = await reviewModel.countDocuments();
        const totalQuestions = await questionModel.countDocuments();
        const pendingRequests = await userModel.countDocuments({ hostelRequestStatus: "pending" });

        // Get users by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const usersByMonth = await userModel.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { 
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Get hostels by type
        const hostelsByType = await hostelModel.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalManagers,
                totalHostels,
                activeHostels,
                totalRooms,
                totalReviews,
                totalQuestions,
                pendingRequests
            },
            usersByMonth,
            hostelsByType
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get all hostels for admin
export const getAdminHostels = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hostels = await hostelModel.find()
            .populate("owner", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            hostels
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Toggle any hostel's active status (admin)
export const adminToggleHostelStatus = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { hostelId, isActive } = req.body;

        const hostel = await hostelModel.findById(hostelId);

        if (!hostel) {
            return next(new ErrorHandler("Hostel not found", 404));
        }

        hostel.isActive = isActive;
        await hostel.save();

        res.status(200).json({
            success: true,
            message: isActive ? "Hostel activated successfully" : "Hostel deactivated successfully",
            hostel
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Toggle hostel featured status
export const toggleFeaturedHostel = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { hostelId, isFeatured } = req.body;

        const hostel = await hostelModel.findById(hostelId);

        if (!hostel) {
            return next(new ErrorHandler("Hostel not found", 404));
        }

        hostel.isFeatured = isFeatured;
        await hostel.save();

        res.status(200).json({
            success: true,
            message: isFeatured ? "Hostel featured successfully" : "Hostel unfeatured successfully",
            hostel
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get featured hostels (public)
export const getFeaturedHostels = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hostels = await hostelModel.find({ isFeatured: true, isActive: { $ne: false } })
            .populate("reviews")
            .limit(6);

        res.status(200).json({
            success: true,
            hostels
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get pending manager requests
export const getPendingRequests = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requests = await userModel.find({ hostelRequestStatus: "pending" })
            .select("name email phone avatar createdAt")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            requests
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Approve or reject manager request
export const handleManagerRequest = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, action } = req.body;

        if (!["approve", "reject"].includes(action)) {
            return next(new ErrorHandler("Invalid action", 400));
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        if (user.hostelRequestStatus !== "pending") {
            return next(new ErrorHandler("No pending request for this user", 400));
        }

        if (action === "approve") {
            user.role = "manager";
            user.hostelRequestStatus = "approved";
        } else {
            user.hostelRequestStatus = "rejected";
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: action === "approve" 
                ? "User approved as manager successfully" 
                : "Request rejected successfully"
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get all users for admin
export const getAdminUsers = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userModel.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            users
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get all reviews for moderation
export const getAllReviews = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviews = await reviewModel.find()
            .populate("user", "name email avatar")
            .populate("hostel", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            reviews
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Delete review (admin)
export const deleteReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { reviewId } = req.params;

        const review = await reviewModel.findById(reviewId);

        if (!review) {
            return next(new ErrorHandler("Review not found", 404));
        }

        // Remove from hostel's reviews array
        await hostelModel.findByIdAndUpdate(review.hostel, {
            $pull: { reviews: reviewId }
        });

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get all questions for moderation
export const getAllQuestions = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const questions = await questionModel.find()
            .populate("user", "name email avatar")
            .populate("hostel", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            questions
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Delete question (admin)
export const deleteQuestion = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { questionId } = req.params;

        const question = await questionModel.findById(questionId);

        if (!question) {
            return next(new ErrorHandler("Question not found", 404));
        }

        // Remove from hostel's questions array
        await hostelModel.findByIdAndUpdate(question.hostel, {
            $pull: { questions: questionId }
        });

        await question.deleteOne();

        res.status(200).json({
            success: true,
            message: "Question deleted successfully"
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Create announcement
export const createAnnouncement = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, message, type } = req.body;

        const announcement = await announcementModel.create({
            title,
            message,
            type: type || "info",
            createdBy: req.user?._id
        });

        res.status(201).json({
            success: true,
            message: "Announcement created successfully",
            announcement
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get all announcements
export const getAnnouncements = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const announcements = await announcementModel.find()
            .populate("createdBy", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            announcements
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get active announcements (public)
export const getActiveAnnouncements = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const announcements = await announcementModel.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            announcements
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Toggle announcement active status
export const toggleAnnouncement = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { announcementId, isActive } = req.body;

        const announcement = await announcementModel.findById(announcementId);

        if (!announcement) {
            return next(new ErrorHandler("Announcement not found", 404));
        }

        announcement.isActive = isActive;
        await announcement.save();

        res.status(200).json({
            success: true,
            message: isActive ? "Announcement activated" : "Announcement deactivated"
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Delete announcement
export const deleteAnnouncement = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { announcementId } = req.params;

        const announcement = await announcementModel.findById(announcementId);

        if (!announcement) {
            return next(new ErrorHandler("Announcement not found", 404));
        }

        await announcement.deleteOne();

        res.status(200).json({
            success: true,
            message: "Announcement deleted successfully"
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

