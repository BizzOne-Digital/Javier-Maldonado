"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import type { Listing } from "@/types/listing";
import { useLabels } from "@/lib/labels";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ListingCard } from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/Button";

async function fetchFeatured(): Promise<Listing[]> {
  const res = await fetch("/api/listings?featured=true");
  if (!res.ok) throw new Error("Failed to fetch listings");
  const json = await res.json();
  return json.data ?? json.listings ?? [];
}

export function FeaturedListings() {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");

  const { data: listings = [], isLoading, isError } = useQuery({
    queryKey: ["listings", "featured"],
    queryFn: fetchFeatured,
  });

  if (isError) return null;

  return (
    <section className="py-24 md:py-32 bg-midnight relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(50,124,154,0.15),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <SectionHeading
            eyebrow="GTA"
            title={t("home.featuredListings")}
            light
            singleLine
          />
          <Button href="/listings" variant="outline" className="shrink-0">
            {t("home.viewAll")}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl bg-slate/50 animate-pulse"
              />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {listings.slice(0, 3).map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        ) : (
          <p className="text-champagne/60 text-center py-12">
            {locale === "es"
              ? "Próximamente nuevas propiedades destacadas."
              : "Featured properties coming soon."}
          </p>
        )}
      </div>
    </section>
  );
}
