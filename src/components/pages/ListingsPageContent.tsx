"use client";

import { useTranslations } from "next-intl";
import type { Listing } from "@/types/listing";
import { PageHero } from "@/components/ui/PageHero";
import { PageTransition } from "@/components/ui/PageTransition";
import { ListingGrid } from "@/components/listings/ListingGrid";

interface ListingsPageContentProps {
  listings: Listing[];
}

export function ListingsPageContent({ listings }: ListingsPageContentProps) {
  const t = useTranslations("pages.listings");
  const common = useTranslations("common");

  return (
    <PageTransition>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} compact />
      <section className="py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {listings.length === 0 ? (
            <p className="text-center text-slate/70 py-16 text-lg">{common("emptyListings")}</p>
          ) : (
            <ListingGrid listings={listings} />
          )}
        </div>
      </section>
    </PageTransition>
  );
}
