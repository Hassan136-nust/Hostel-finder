import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middlewares/CatchAsyncErrorMiddleware";
import ErrorHandler from "../utils/ErrorHandler";
import userModel from "../models/user.model";
import roomModel from "../models/room.model";

// Add room to favorites
export const addToFavorites = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roomId } = req.body;
        const userId = req.user?._id;

        const room = await roomModel.findById(roomId);
        if (!room) {
            return next(new ErrorHandler("Room not found", 404));
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Check if already in favorites
        if (user.favoriteRooms.includes(roomId)) {
            return res.status(200).json({
                success: true,
                message: "Room already in favorites"
            });
        }

        user.favoriteRooms.push(roomId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Room added to favorites"
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Remove room from favorites
export const removeFromFavorites = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roomId } = req.params;
        const userId = req.user?._id;

        const user = await userModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        user.favoriteRooms = user.favoriteRooms.filter(
            (id) => id.toString() !== roomId
        );
        await user.save();

        res.status(200).json({
            success: true,
            message: "Room removed from favorites"
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get user's favorite rooms
export const getFavoriteRooms = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;

        const user = await userModel.findById(userId).populate({
            path: "favoriteRooms",
            populate: {
                path: "hostel",
                select: "name city images"
            }
        });

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        res.status(200).json({
            success: true,
            favorites: user.favoriteRooms
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Check if room is in favorites
export const checkFavorite = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roomId } = req.params;
        const userId = req.user?._id;

        const user = await userModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const isFavorite = user.favoriteRooms.some(
            (id) => id.toString() === roomId
        );

        res.status(200).json({
            success: true,
            isFavorite
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});
