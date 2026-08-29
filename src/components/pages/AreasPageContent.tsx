"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { PageHero } from "@/components/ui/PageHero";
import { PageTransition } from "@/components/ui/PageTransition";
import { GradientCard } from "@/components/ui/GradientCard";

export function AreasPageContent() {
  const t = useTranslations("pages.areas");

  return (
    <PageTransition>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} compact />

      <section className="py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {siteConfig.serviceAreas.map((city, i) => (
              <motion.div
                key={city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <GradientCard tilt={false} className="h-full">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lake/15 text-lake">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="font-display text-2xl text-midnight mb-2">{city}</h2>
                      <p className="text-slate/70 text-sm mb-4">
                        {t("subtitle")}
                      </p>
                      <Link
                        href={`/listings?city=${encodeURIComponent(city)}`}
                        className="font-label text-xs uppercase tracking-wider text-copper hover:text-lake transition-colors"
                      >
                        {t("cta", { city })}
                      </Link>
                    </div>
                  </div>
                </GradientCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
