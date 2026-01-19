import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middlewares/CatchAsyncErrorMiddleware";
import ErrorHandler from "../utils/ErrorHandler";
import userModel from "../models/user.model";
import hostelModel from "../models/hostel.model";
import roomModel from "../models/room.model";
import reviewModel from "../models/review.model";
import questionModel from "../models/question.model";

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
