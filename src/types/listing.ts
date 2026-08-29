export type ListingStatus = "for_sale" | "for_lease" | "sold" | "leased";

export interface ListingImage {
  url: string;
  publicId?: string;
  order: number;
}

export interface LocalizedListingContent {
  title?: string;
  description?: string;
  features?: string[];
}

export interface Listing {
  _id: string;
  slug: string;
  status: ListingStatus;
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
  images: ListingImage[];
  featured: boolean;
  published: boolean;
  en: LocalizedListingContent;
  es: LocalizedListingContent;
}

export interface ListingFiltersState {
  city?: string;
  status?: ListingStatus | "all";
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  propertyType?: string;
}
