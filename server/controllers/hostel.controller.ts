import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middlewares/CatchAsyncErrorMiddleware";
import ErrorHandler from "../utils/ErrorHandler";
import hostelModel from "../models/hostel.model";
import { v2 as cloudinary } from "cloudinary";
import "../models/review.model";
import "../models/question.model";

//createHostel
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