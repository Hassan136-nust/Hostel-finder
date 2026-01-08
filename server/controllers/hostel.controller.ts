import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middlewares/CatchAsyncErrorMiddleware";
import ErrorHandler from "../utils/ErrorHandler";
import hostelModel from "../models/hostel.model";
import { v2 as cloudinary } from "cloudinary";
import "../models/review.model";
import "../models/question.model";
import roomModel from "../models/room.model";
import reviewModel from "../models/review.model";
import questionModel from "../models/question.model";


export const createHostel = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, address, city, description, type, facilities, contactPhone, images } = req.body;

        if (!name || !address || !city || !description || !type || !contactPhone) {
            return next(new ErrorHandler("Please fill all required fields", 400));
        }

        const imageLinks = [];
        if (images && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.uploader.upload(images[i], {
                    folder: "hostels", 
                });
                
                imageLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
        } else {
            return next(new ErrorHandler("Please upload at least one image of the hostel", 400));
        }

        const hostel = await hostelModel.create({
            name,
            address,
            city,
            description,
            type,
            facilities,
            contactPhone,
            images: imageLinks,
            owner: req.user?._id 
        });

        res.status(201).json({
            success: true,
            message: "Hostel created successfully!",
            hostel
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getAllHostels = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hostels = await hostelModel.find().populate("reviews"); 
        
        res.status(200).json({
            success: true,
            count: hostels.length,
            hostels
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


export const updateHostel = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, address, city, description, type, facilities, contactPhone, images } = req.body;

        const hostel = await hostelModel.findById(id);

        if (!hostel) {
            return next(new ErrorHandler("Hostel not found", 404));
        }

        if (hostel.owner.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
            return next(new ErrorHandler("You are not authorized to update this hostel", 403));
        }

        if (name) hostel.name = name;
        if (address) hostel.address = address;
        if (city) hostel.city = city;
        if (description) hostel.description = description;
        if (type) hostel.type = type;
        if (facilities) hostel.facilities = facilities;
        if (contactPhone) hostel.contactPhone = contactPhone;

        if (images && images.length > 0) {
            for (const img of hostel.images) {
                if (img.public_id) {
                    await cloudinary.uploader.destroy(img.public_id);
                }
            }

            const imageLinks = [];
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.uploader.upload(images[i], {
                    folder: "hostels",
                });
                imageLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
            hostel.images = imageLinks;
        }

        await hostel.save();

        res.status(200).json({
            success: true,
            message: "Hostel updated successfully",
            hostel
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const deleteHostel = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const hostel = await hostelModel.findById(id);

        if (!hostel) {
            return next(new ErrorHandler("Hostel not found", 404));
        }

        if (hostel.owner.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
            return next(new ErrorHandler("You are not authorized to delete this hostel", 403));
        }

        if (hostel.images && hostel.images.length > 0) {
            for (const img of hostel.images) {
                if (img.public_id) {
                    await cloudinary.uploader.destroy(img.public_id);
                }
            }
        }

        const rooms = await roomModel.find({ hostel: id });
        for (const room of rooms) {
            if (room.images && room.images.length > 0) {
                for (const img of room.images) {
                    if (img.public_id) {
                        await cloudinary.uploader.destroy(img.public_id);
                    }
                }
            }
        }

        await roomModel.deleteMany({ hostel: id });
        await reviewModel.deleteMany({ hostel: id });
        await questionModel.deleteMany({ hostel: id });

        await hostel.deleteOne();

        res.status(200).json({
            success: true,
            message: "Hostel and all related data (rooms, reviews, questions) deleted successfully"
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});