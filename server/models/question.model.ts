import mongoose, { Document, Model, Schema } from "mongoose";

interface IReply {
    user: mongoose.Types.ObjectId;
    answer: string;
    createdAt: Date;
}

export interface IQuestion extends Document {
    user: mongoose.Types.ObjectId;   
    hostel: mongoose.Types.ObjectId; 
    question: string;
    replies: IReply[];               
}

const questionSchema: Schema<IQuestion> = new mongoose.Schema({
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
    question: {
        type: String,
        required: [true, "Please ask a question"]
    },
    replies: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            answer: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const questionModel: Model<IQuestion> = mongoose.model<IQuestion>("Question", questionSchema);
export default questionModel;