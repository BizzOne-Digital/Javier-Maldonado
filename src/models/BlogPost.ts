import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogPost extends Document {
  slug: string;
  category: string;
  featuredImage?: string;
  published: boolean;
  publishedAt?: Date;
  scheduledAt?: Date;
  en: { title: string; excerpt: string; content: string; seoTitle?: string; seoDescription?: string };
  es: { title: string; excerpt: string; content: string; seoTitle?: string; seoDescription?: string };
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true, index: true },
    featuredImage: String,
    published: { type: Boolean, default: false, index: true },
    publishedAt: Date,
    scheduledAt: Date,
    en: { title: String, excerpt: String, content: String, seoTitle: String, seoDescription: String },
    es: { title: String, excerpt: String, content: String, seoTitle: String, seoDescription: String },
  },
  { timestamps: true }
);

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
