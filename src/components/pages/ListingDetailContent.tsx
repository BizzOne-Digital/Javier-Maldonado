"use client";

import { ContentImage } from "@/components/ui/ContentImage";
import { motion } from "framer-motion";
import { Bath, Bed, MapPin, Ruler } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Listing } from "@/types/listing";
import { formatCurrency } from "@/lib/utils";
import { PageHero } from "@/components/ui/PageHero";
import { PageTransition } from "@/components/ui/PageTransition";
import { GradientCard } from "@/components/ui/GradientCard";
import { Button } from "@/components/ui/Button";
import { LeadForm } from "@/components/forms/LeadForm";

interface ListingDetailContentProps {
  listing: Listing;
}

export function ListingDetailContent({ listing }: ListingDetailContentProps) {
  const locale = useLocale();
  const t = useTranslations("pages.listingDetail");
  const common = useTranslations("common");
  const content = locale === "es" ? listing.es : listing.en;
  const images = [...(listing.images || [])].sort((a, b) => a.order - b.order);
  const heroImage = images[0]?.url;

  return (
    <PageTransition>
      <PageHero
        eyebrow={listing.city}
        title={content.title || listing.address}
        subtitle={listing.address}
        compact
      />

      <section className="py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xl"
              >
                {heroImage ? (
                  <ContentImage
                    src={heroImage}
                    alt={content.title || listing.address}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                ) : (
                  <div className="absolute inset-0 gradient-hero" />
                )}
              </motion.div>

              {images.length > 1 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.slice(1, 5).map((img) => (
                    <div key={img.url} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                      <ContentImage src={img.url} alt="" fill className="object-cover" sizes="200px" />
                    </div>
                  ))}
                </div>
              )}

              {content.description && (
                <div>
                  <h2 className="font-display text-2xl text-midnight mb-4">Overview</h2>
                  <p className="text-slate/85 leading-relaxed whitespace-pre-line">{content.description}</p>
                </div>
              )}

              {content.features && content.features.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl text-midnight mb-4">{t("features")}</h2>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {content.features.map((feature) => (
                      <li key={feature} className="text-slate/80 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-copper" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <GradientCard tilt={false} glow>
                <p className="font-display text-3xl text-midnight mb-2">
                  {formatCurrency(listing.price, locale === "es" ? "es-CA" : "en-CA")}
                </p>
                <p className="text-slate/70 flex items-center gap-2 mb-6">
                  <MapPin className="h-4 w-4 text-lake" />
                  {listing.address}, {listing.city}
                </p>

                <h3 className="font-label text-xs uppercase tracking-wider text-lake mb-4">
                  {t("details")}
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-champagne/20 pb-2">
                    <dt className="text-slate/60">{t("propertyType")}</dt>
                    <dd className="font-medium capitalize">{listing.propertyType}</dd>
                  </div>
                  <div className="flex justify-between border-b border-champagne/20 pb-2">
                    <dt className="text-slate/60 flex items-center gap-1">
                      <Bed className="h-3.5 w-3.5" /> {t("bedrooms")}
                    </dt>
                    <dd className="font-medium">{listing.bedrooms}</dd>
                  </div>
                  <div className="flex justify-between border-b border-champagne/20 pb-2">
                    <dt className="text-slate/60 flex items-center gap-1">
                      <Bath className="h-3.5 w-3.5" /> {t("bathrooms")}
                    </dt>
                    <dd className="font-medium">{listing.bathrooms}</dd>
                  </div>
                  {listing.squareFootage && (
                    <div className="flex justify-between border-b border-champagne/20 pb-2">
                      <dt className="text-slate/60 flex items-center gap-1">
                        <Ruler className="h-3.5 w-3.5" /> {t("squareFootage")}
                      </dt>
                      <dd className="font-medium">{listing.squareFootage.toLocaleString()} sq ft</dd>
                    </div>
                  )}
                  {listing.parking && (
                    <div className="flex justify-between border-b border-champagne/20 pb-2">
                      <dt className="text-slate/60">{t("parking")}</dt>
                      <dd className="font-medium">{listing.parking}</dd>
                    </div>
                  )}
                  {listing.mlsNumber && (
                    <div className="flex justify-between pb-2">
                      <dt className="text-slate/60">{t("mls")}</dt>
                      <dd className="font-medium">{listing.mlsNumber}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-6 flex flex-col gap-3">
                  <Button href="/booking" magnetic className="w-full justify-center">
                    {common("requestShowing")}
                  </Button>
                  <Button href="/contact" variant="outline" className="w-full justify-center">
                    {common("emailUs")}
                  </Button>
                </div>
              </GradientCard>

              <GradientCard tilt={false}>
                <LeadForm source={`listing-${listing.slug}`} />
              </GradientCard>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
