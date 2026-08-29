import { z } from "zod";

const localizedListingContent = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const listingQuerySchema = z.object({
  city: z.string().optional(),
  status: z.enum(["for_sale", "for_lease", "sold", "leased"]).optional(),
  type: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  beds: z.coerce.number().optional(),
  baths: z.coerce.number().optional(),
  sort: z.enum(["price_asc", "price_desc", "newest", "oldest"]).optional().default("newest"),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(12),
});

export const listingCreateSchema = z.object({
  slug: z.string().optional(),
  status: z.enum(["for_sale", "for_lease", "sold", "leased"]).default("for_sale"),
  price: z.number().min(0),
  address: z.string().min(1),
  city: z.string().min(1),
  neighbourhood: z.string().optional(),
  propertyType: z.string().min(1),
  bedrooms: z.number().min(0).default(0),
  bathrooms: z.number().min(0).default(0),
  squareFootage: z.number().optional(),
  parking: z.string().optional(),
  mlsNumber: z.string().optional(),
  images: z
    .array(z.object({ url: z.string(), publicId: z.string(), order: z.number() }))
    .optional()
    .default([]),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  en: localizedListingContent.optional(),
  es: localizedListingContent.optional(),
  brokerageAttribution: z.string().optional(),
});

export const listingUpdateSchema = listingCreateSchema.partial();

export const leadTypeEnum = z.enum([
  "buyer",
  "seller",
  "rental",
  "investor",
  "contact",
  "home-value",
  "property-inquiry",
  "resource-download",
]);

export const leadCreateSchema = z.object({
  type: leadTypeEnum,
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
  language: z.string().optional().default("en"),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});

export const leadStatusEnum = z.enum([
  "new",
  "contacted",
  "qualified",
  "appointment_scheduled",
  "closed",
  "archived",
]);

export const leadUpdateSchema = z.object({
  id: z.string().min(1),
  status: leadStatusEnum.optional(),
  internalNotes: z.string().optional(),
});

export const leadQuerySchema = z.object({
  status: leadStatusEnum.optional(),
  type: leadTypeEnum.optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  export: z.enum(["csv"]).optional(),
});

export const bookingCreateSchema = z.object({
  consultationType: z.string().min(1),
  preferredDate: z.string().min(1),
  preferredTime: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  message: z.string().optional(),
  language: z.string().optional().default("en"),
});

export const bookingStatusEnum = z.enum(["pending", "confirmed", "completed", "cancelled"]);

export const bookingUpdateSchema = z.object({
  id: z.string().min(1),
  status: bookingStatusEnum.optional(),
  internalNotes: z.string().optional(),
});

export const bookingQuerySchema = z.object({
  status: bookingStatusEnum.optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

export const testimonialSchema = z.object({
  name: z.string().min(1),
  location: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  order: z.number().optional().default(0),
  en: z.object({ quote: z.string().optional() }).optional(),
  es: z.object({ quote: z.string().optional() }).optional(),
});

export const blogPostSchema = z.object({
  slug: z.string().optional(),
  category: z.string().min(1),
  featuredImage: z.string().optional(),
  published: z.boolean().optional().default(false),
  publishedAt: z.coerce.date().optional(),
  scheduledAt: z.coerce.date().optional(),
  en: z
    .object({
      title: z.string().optional(),
      excerpt: z.string().optional(),
      content: z.string().optional(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    })
    .optional(),
  es: z
    .object({
      title: z.string().optional(),
      excerpt: z.string().optional(),
      content: z.string().optional(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    })
    .optional(),
});

export const teamMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  headshot: z.string().optional(),
  order: z.number().optional().default(0),
  published: z.boolean().optional().default(false),
  en: z.object({ bio: z.string().optional() }).optional(),
  es: z.object({ bio: z.string().optional() }).optional(),
  social: z
    .object({
      linkedin: z.string().optional(),
      instagram: z.string().optional(),
    })
    .optional(),
});

export const resourceSchema = z.object({
  slug: z.string().optional(),
  fileUrl: z.string().min(1),
  publicId: z.string().optional(),
  published: z.boolean().optional().default(false),
  en: z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
  es: z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
});

export const resourceDownloadSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  language: z.string().optional().default("en"),
});

export const serviceSchema = z.object({
  slug: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().optional().default(0),
  published: z.boolean().optional().default(false),
  image: z.string().optional(),
  en: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      content: z.string().optional(),
    })
    .optional(),
  es: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      content: z.string().optional(),
    })
    .optional(),
});

export const settingsPatchSchema = z.object({
  settings: z.record(z.string(), z.record(z.string(), z.unknown())),
});
