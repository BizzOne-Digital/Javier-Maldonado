import mongoose, { Schema, Document, Model } from "mongoose";

const LocalizedContent = {
  title: String,
  description: String,
  features: [String],
  seoTitle: String,
  seoDescription: String,
};

export interface IListing extends Document {
  slug: string;
  status: "for_sale" | "for_lease" | "sold" | "leased";
  price: number;
  address: string;
  city: string;
  neighbourhood?: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage?: number;
  parking?: string;
  mlsNumber?: string;
  images: { url: string; publicId: string; order: number }[];
  featured: boolean;
  published: boolean;
  en: typeof LocalizedContent;
  es: typeof LocalizedContent;
  brokerageAttribution?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ["for_sale", "for_lease", "sold", "leased"], default: "for_sale" },
    price: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    neighbourhood: String,
    propertyType: { type: String, required: true },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    squareFootage: Number,
    parking: String,
    mlsNumber: String,
    images: [{ url: String, publicId: String, order: Number }],
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: false, index: true },
    en: LocalizedContent,
    es: LocalizedContent,
    brokerageAttribution: String,
  },
  { timestamps: true }
);

const Listing: Model<IListing> =
  mongoose.models.Listing || mongoose.model<IListing>("Listing", ListingSchema);

export default Listing;
