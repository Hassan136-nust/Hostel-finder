import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middlewares/CatchAsyncErrorMiddleware";
import ErrorHandler from "../utils/ErrorHandler";
import reviewModel from "../models/review.model";
import hostelModel from "../models/hostel.model";
import mongoose from "mongoose";

export const addReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { hostelId, rating, comment } = req.body;

        const hostel = await hostelModel.findById(hostelId);
        if (!hostel) {
            return next(new ErrorHandler("Hostel not found", 404));
        }

        const review = await reviewModel.create({
            user: req.user?._id,
            hostel: hostelId,
            rating,
            comment
        });

        hostel.reviews.push(review._id);
        
      
        await hostel.save();

        res.status(201).json({
            success: true,
            review
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getHostelReviews = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviews = await reviewModel.find({ hostel: req.params.hostelId })
                                         .populate("user", "name avatar"); // User ka naam aur photo bhi laye ga

        res.status(200).json({
            success: true,
            reviews
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const replyToReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { reviewId, message } = req.body;

        const review = await reviewModel.findById(reviewId).populate("hostel");

        if (!review) {
            return next(new ErrorHandler("Review not found", 404));
        }

        const hostelOwnerId = (review.hostel as any).owner.toString();
        
        if (hostelOwnerId !== req.user?._id.toString()) {
            return next(new ErrorHandler("Not authorized to reply", 403));
        }

        review.reply = {
            managerId: req.user?._id as mongoose.Types.ObjectId,
            message,
            createdAt: new Date()
        };

        await review.save();

        res.status(200).json({
            success: true,
            message: "Reply added successfully",
            review
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get user's own reviews
export const getUserReviews = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;

        const reviews = await reviewModel.find({ user: userId })
            .populate("hostel", "name city images")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            reviews
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});