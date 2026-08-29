"use client";

import { useRef } from "react";
import { ContentImage } from "@/components/ui/ContentImage";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Bath, Bed, MapPin } from "lucide-react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import type { Listing } from "@/types/listing";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLabels } from "@/lib/labels";
import { formatCurrency, cn } from "@/lib/utils";

interface ListingCardProps {
  listing: Listing;
  className?: string;
}

const statusLabels: Record<string, string> = {
  for_sale: "listings.forSale",
  for_lease: "listings.forLease",
  sold: "listings.sold",
  leased: "listings.sold",
};

export function ListingCard({ listing, className }: ListingCardProps) {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const content = locale === "es" ? listing.es : listing.en;
  const image = listing.images?.sort((a, b) => a.order - b.order)[0]?.url;

  const handleMove = (e: React.MouseEvent) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={!reducedMotion ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
      className={cn("group perspective-[1000px]", className)}
    >
      <Link
        href={`/listings/${listing.slug}`}
        className="block relative rounded-2xl overflow-hidden bg-midnight shadow-xl shadow-midnight/10"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/20 to-transparent z-10" />
        <div className="aspect-[4/3] relative overflow-hidden">
          {image ? (
            <ContentImage
              src={image}
              alt={content.title || listing.address}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 gradient-hero" />
          )}
        </div>
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 rounded-full bg-copper/90 text-midnight text-xs font-label uppercase tracking-wider">
            {t(statusLabels[listing.status] || "listings.forSale")}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
          <p className="font-display text-2xl text-ivory mb-1">
            {formatCurrency(listing.price, locale === "es" ? "es-CA" : "en-CA")}
          </p>
          <p className="text-champagne/90 font-medium truncate">
            {content.title || listing.address}
          </p>
          <div className="flex items-center gap-4 mt-3 text-sm text-champagne/70">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {listing.city}
            </span>
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" />
              {listing.bedrooms} {t("listings.beds")}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" />
              {listing.bathrooms} {t("listings.baths")}
            </span>
          </div>
        </div>
        <div className="absolute inset-0 rounded-2xl border border-champagne/0 group-hover:border-champagne/30 transition-colors pointer-events-none z-30" />
      </Link>
    </motion.div>
  );
}
