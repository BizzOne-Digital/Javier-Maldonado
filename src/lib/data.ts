import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import BlogPost from "@/models/BlogPost";
import Testimonial from "@/models/Testimonial";
import TeamMember from "@/models/TeamMember";
import Resource from "@/models/Resource";
import type { Listing as ListingType } from "@/types/listing";

export async function getPublishedListings(limit = 100) {
  try {
    await connectDB();
    const listings = await Listing.find({ published: true })
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit)
      .lean();
    return JSON.parse(JSON.stringify(listings)) as ListingType[];
  } catch {
    return [] as ListingType[];
  }
}

export async function getListingBySlug(slug: string) {
  try {
    await connectDB();
    const listing = await Listing.findOne({ slug, published: true }).lean();
    if (!listing) return null;
    return JSON.parse(JSON.stringify(listing)) as ListingType;
  } catch {
    return null;
  }
}

export async function getPublishedBlogPosts(limit = 50) {
  try {
    await connectDB();
    const posts = await BlogPost.find({ published: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .select("-en.content -es.content")
      .lean();
    return JSON.parse(JSON.stringify(posts));
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug, published: true }).lean();
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
  } catch {
    return null;
  }
}

export async function getPublishedTestimonials() {
  try {
    await connectDB();
    const testimonials = await Testimonial.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(testimonials));
  } catch {
    return [];
  }
}

export async function getPublishedTeam() {
  try {
    await connectDB();
    const team = await TeamMember.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(team));
  } catch {
    return [];
  }
}

export async function getPublishedResources() {
  try {
    await connectDB();
    const resources = await Resource.find({ published: true })
      .select("-fileUrl -publicId")
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(resources));
  } catch {
    return [];
  }
}
