"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { PageHero } from "@/components/ui/PageHero";
import { PageTransition } from "@/components/ui/PageTransition";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GradientCard } from "@/components/ui/GradientCard";
import { Button } from "@/components/ui/Button";

export function AboutPageContent() {
  const t = useTranslations("pages.about");
  const values = t.raw("values") as string[];

  return (
    <PageTransition>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <SectionHeading
                eyebrow={siteConfig.name}
                title={t("storyTitle")}
                subtitle={t("storySubtitle")}
              />
              <p className="mt-8 text-slate/85 leading-relaxed text-lg">{t("storyBody")}</p>
              <p className="mt-4 text-sm text-slate/60">{siteConfig.brokerage}</p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-midnight/10"
            >
              <div className="absolute inset-0 gradient-hero" />
              <Image
                src="/logo.png"
                alt={siteConfig.name}
                width={280}
                height={280}
                className="absolute inset-0 m-auto rounded-full border border-champagne/20"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-midnight">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading
            eyebrow={t("valuesEyebrow")}
            title={t("valuesTitle")}
            light
            align="center"
            className="mb-12"
          />
          <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            {values.map((value, i) => (
              <GradientCard key={value} tilt={false}>
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lake/15 text-lake">
                    <Check className="h-4 w-4" />
                  </span>
                  <p className="text-slate/85">{value}</p>
                </div>
              </GradientCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-ivory text-center">
        <div className="mx-auto max-w-2xl px-4 md:px-6">
          <h2 className="font-display text-3xl md:text-4xl text-midnight mb-4">{t("ctaTitle")}</h2>
          <p className="text-slate/80 mb-8">{t("ctaSubtitle")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/booking" size="lg" magnetic>
              {t("ctaTitle")}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Contact
            </Button>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
