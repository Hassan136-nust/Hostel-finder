import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAnnouncement extends Document {
    title: string;
    message: string;
    type: "info" | "warning" | "success" | "error";
    isActive: boolean;
    createdBy: mongoose.Types.ObjectId;
}

const announcementSchema: Schema<IAnnouncement> = new mongoose.Schema(
    {
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: { 
            type: String, 
            enum: ["info", "warning", "success", "error"], 
            default: "info" 
        },
        isActive: { type: Boolean, default: true },
        createdBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        }
    },
    { timestamps: true }
);

const announcementModel: Model<IAnnouncement> = mongoose.model<IAnnouncement>(
    "Announcement",
    announcementSchema
);

export default announcementModel;
