import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResource extends Document {
  slug: string;
  fileUrl: string;
  publicId: string;
  downloadCount: number;
  published: boolean;
  en: { title: string; description: string };
  es: { title: string; description: string };
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    slug: { type: String, required: true, unique: true },
    fileUrl: { type: String, required: true },
    publicId: String,
    downloadCount: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    en: { title: String, description: String },
    es: { title: String, description: String },
  },
  { timestamps: true }
);

const Resource: Model<IResource> =
  mongoose.models.Resource || mongoose.model<IResource>("Resource", ResourceSchema);

export default Resource;
