"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { useLocale } from "next-intl";
import type { Listing, ListingFiltersState } from "@/types/listing";
import { useLabels } from "@/lib/labels";
import { ListingCard } from "./ListingCard";
import { ListingFilters } from "./ListingFilters";

interface ListingGridProps {
  listings: Listing[];
  className?: string;
}

export function ListingGrid({ listings, className }: ListingGridProps) {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");
  const [filters, setFilters] = useState<ListingFiltersState>({ status: "all" });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (filters.city && l.city !== filters.city) return false;
      if (filters.status && filters.status !== "all" && l.status !== filters.status) return false;
      if (filters.minPrice && l.price < filters.minPrice) return false;
      if (filters.maxPrice && l.price > filters.maxPrice) return false;
      if (filters.bedrooms && l.bedrooms < filters.bedrooms) return false;
      if (filters.propertyType && l.propertyType !== filters.propertyType) return false;
      return true;
    });
  }, [listings, filters]);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-8">
        <p className="text-slate/70 text-sm">
          {filtered.length} {locale === "es" ? "propiedades" : "properties"}
        </p>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-champagne/30 bg-ivory hover:border-lake transition-colors text-sm font-medium text-midnight"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t("listings.filters")}
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-slate/60 py-16">{t("listings.noResults")}</p>
      ) : (
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {filtered.map((listing) => (
            <motion.div
              key={listing._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <ListingCard listing={listing} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <ListingFilters
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onApply={setFilters}
        listings={listings}
      />
    </div>
  );
}
