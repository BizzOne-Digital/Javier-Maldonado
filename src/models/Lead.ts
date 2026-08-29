import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILead extends Document {
  type: string;
  status: "new" | "contacted" | "qualified" | "appointment_scheduled" | "closed" | "archived";
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
  language: string;
  metadata: Record<string, unknown>;
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    type: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "appointment_scheduled", "closed", "archived"],
      default: "new",
      index: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: String,
    message: String,
    source: String,
    language: { type: String, default: "en" },
    metadata: { type: Schema.Types.Mixed, default: {} },
    internalNotes: String,
  },
  { timestamps: true }
);

const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);

export default Lead;
