import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReview extends Document {
    user: mongoose.Types.ObjectId;   
    hostel: mongoose.Types.ObjectId; 
    rating: number;                  
    comment: string;                 
    reply?: {                        
        managerId: mongoose.Types.ObjectId;
        message: string;
        createdAt: Date;
    }; 
}

const reviewSchema: Schema<IReview> = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hostel",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    reply: { 
        managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: { type: String },
        createdAt: { type: Date, default: Date.now }
    }
}, { timestamps: true });

const reviewModel: Model<IReview> = mongoose.model<IReview>("Review", reviewSchema);
export default reviewModel;