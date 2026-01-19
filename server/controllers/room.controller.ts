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

export const updateRoom = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { type, price, description, amenities, images } = req.body;

        const room = await roomModel.findById(id);
        if (!room) {
            return next(new ErrorHandler("Room not found", 404));
        }

        const hostel = await hostelModel.findById(room.hostel);
        if (!hostel) {
            return next(new ErrorHandler("Hostel not found", 404));
        }
        
        if (hostel.owner.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
            return next(new ErrorHandler("You are not authorized to update this room", 403));
        }

        if (type) room.type = type as "Single" | "Double" | "Three Seater" | "Four Seater";
        if (price !== undefined) room.price = price;
        if (description) room.description = description;
        if (amenities) room.amenities = amenities;

        if (images && images.length > 0) {
            for (const img of room.images) {
                if (img.public_id) {
                    await cloudinary.uploader.destroy(img.public_id);
                }
            }

            const imageLinks = [];
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.uploader.upload(images[i], {
                    folder: "rooms",
                });
                imageLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
            room.images = imageLinks;
        }

        await room.save();

        res.status(200).json({
            success: true,
            message: "Room updated successfully!",
            room
        });

    } catch (error: any) {
        console.error("Update room error:", error);
        return next(new ErrorHandler(error.message, 500));
    }
});

export const deleteRoom = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const room = await roomModel.findById(id);
        if (!room) {
            return next(new ErrorHandler("Room not found", 404));
        }

        const hostel = await hostelModel.findById(room.hostel);
        if (!hostel || hostel.owner.toString() !== req.user?._id.toString()) {
            return next(new ErrorHandler("You are not authorized to delete this room", 403));
        }

        for (const img of room.images) {
            if (img.public_id) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        }

        await roomModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Room deleted successfully!"
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const toggleRoomAvailability = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const room = await roomModel.findById(id);
        if (!room) {
            return next(new ErrorHandler("Room not found", 404));
        }

        const hostel = await hostelModel.findById(room.hostel);
        if (!hostel || hostel.owner.toString() !== req.user?._id.toString()) {
            return next(new ErrorHandler("You are not authorized to update this room", 403));
        }

        room.isAvailable = !room.isAvailable;
        await room.save();

        res.status(200).json({
            success: true,
            message: `Room marked as ${room.isAvailable ? "available" : "unavailable"}`,
            room
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});