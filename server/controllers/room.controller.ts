import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middlewares/CatchAsyncErrorMiddleware";
import ErrorHandler from "../utils/ErrorHandler";
import roomModel from "../models/room.model";
import hostelModel from "../models/hostel.model";
import { v2 as cloudinary } from "cloudinary";

export const createRoom = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { hostelId, type, price, description, amenities, images } = req.body;

        const hostel = await hostelModel.findById(hostelId);
        if (!hostel) {
            return next(new ErrorHandler("Hostel not found", 404));
        }

        if (hostel.owner.toString() !== req.user?._id.toString()) {
            return next(new ErrorHandler("You are not allowed to add rooms to this hostel", 403));
        }

        const imageLinks = [];
        if (images && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.uploader.upload(images[i], {
                    folder: "rooms",
                });
                imageLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
        }

        const room = await roomModel.create({
            hostel: hostelId,
            type,
            price,
            description,
            amenities,
            images: imageLinks
        });

        res.status(201).json({
            success: true,
            message: "Room added successfully!",
            room
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getHostelRooms = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { hostelId } = req.params;

        const rooms = await roomModel.find({ hostel: hostelId });

        res.status(200).json({
            success: true,
            rooms
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});