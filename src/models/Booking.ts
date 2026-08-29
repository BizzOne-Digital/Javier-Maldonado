import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  language: string;
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    consultationType: { type: String, required: true },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: String,
    status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending", index: true },
    language: { type: String, default: "en" },
    internalNotes: String,
  },
  { timestamps: true }
);

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
