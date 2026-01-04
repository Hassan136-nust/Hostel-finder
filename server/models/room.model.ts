import mongoose, { Document, Model, Schema } from "mongoose";

export interface IRoom extends Document {
    hostel: mongoose.Types.ObjectId; 
    type: "Single" | "Double" | "Three Seater" | "Four Seater";
    price: number;
    description: string;
    images: {
        public_id: string;
        url: string;
    }[];
    amenities: string[]; 
    isAvailable: boolean;
}

const roomSchema: Schema<IRoom> = new mongoose.Schema({
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hostel",
        required: true
    },
    type: {
        type: String,
        enum: ["Single", "Double", "Three Seater", "Four Seater"],
        required: [true, "Please select room type"]
    },
    price: {
        type: Number,
        required: [true, "Please enter price per month"]
    },
    description: {
        type: String,
        required: [true, "Please enter room description"]
    },
    images: [
        {
            public_id: String,
            url: String
        }
    ],
    amenities: [
        { type: String }
    ],
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const roomModel: Model<IRoom> = mongoose.model<IRoom>("Room", roomSchema);
export default roomModel;