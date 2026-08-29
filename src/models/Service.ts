import mongoose, { Schema, Document, Model } from "mongoose";

export interface IService extends Document {
  slug: string;
  icon?: string;
  order: number;
  published: boolean;
  en: { title: string; description: string; content?: string };
  es: { title: string; description: string; content?: string };
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    slug: { type: String, required: true, unique: true },
    icon: String,
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    en: { title: String, description: String, content: String },
    es: { title: String, description: String, content: String },
    image: String,
  },
  { timestamps: true }
);

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
