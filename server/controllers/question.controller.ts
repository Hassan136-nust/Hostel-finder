import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middlewares/CatchAsyncErrorMiddleware";
import ErrorHandler from "../utils/ErrorHandler";
import questionModel from "../models/question.model";
import hostelModel from "../models/hostel.model";
import mongoose from "mongoose";

export const askQuestion = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { hostelId, question } = req.body;

        const hostel = await hostelModel.findById(hostelId);
        if (!hostel) return next(new ErrorHandler("Hostel not found", 404));

        const newQuestion = await questionModel.create({
            user: req.user?._id,
            hostel: hostelId,
            question
        });

        hostel.questions.push(newQuestion._id);
        await hostel.save();

        res.status(201).json({ success: true, newQuestion });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const answerQuestion = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { questionId, answer } = req.body;

        const question = await questionModel.findById(questionId);
        if (!question) return next(new ErrorHandler("Question not found", 404));

        question.replies.push({
            user: req.user?._id as mongoose.Types.ObjectId , 
            answer,
            createdAt: new Date()
        });

        await question.save();

        res.status(200).json({ success: true, question });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getHostelQuestions = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const questions = await questionModel.find({ hostel: req.params.hostelId })
            .populate("user", "name") 
            .populate("replies.user", "name"); 

        res.status(200).json({ success: true, questions });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});