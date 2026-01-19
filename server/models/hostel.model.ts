import mongoose, { Document, Model, Schema } from "mongoose";

export interface IHostel extends Document {
  name: string;
  address: string;
  city: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  type: "Boys" | "Girls" | "Family";
  images: {
    public_id: string;
    url: string;
  }[];
  facilities: string[];
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  contactPhone: string;
  reviews: mongoose.Types.ObjectId[]; 
  questions: mongoose.Types.ObjectId[]; 
  rating: number;
  isActive: boolean;
}

const hostelSchema: Schema<IHostel> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    description: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, enum: ["Boys", "Girls", "Family"], required: true },
    images: [{ public_id: String, url: String }],
    facilities: [{ type: String }],
    tags: [{ type: String }],
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    },
    contactPhone: { type: String, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    rating: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const hostelModel: Model<IHostel> = mongoose.model<IHostel>(
  "Hostel",
  hostelSchema
);
export default hostelModel;

