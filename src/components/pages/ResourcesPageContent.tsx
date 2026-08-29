"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageHero } from "@/components/ui/PageHero";
import { PageTransition } from "@/components/ui/PageTransition";
import { GradientCard } from "@/components/ui/GradientCard";
import { LeadForm } from "@/components/forms/LeadForm";

interface ResourceItem {
  _id: string;
  slug: string;
  en: { title: string; description: string };
  es: { title: string; description: string };
}

interface ResourcesPageContentProps {
  resources: ResourceItem[];
}

export function ResourcesPageContent({ resources }: ResourcesPageContentProps) {
  const locale = useLocale();
  const t = useTranslations("pages.resources");

  return (
    <PageTransition>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} compact />

      <section className="py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {resources.length === 0 ? (
            <p className="text-center text-slate/70 py-16 text-lg">{t("empty")}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource, i) => {
                const content = locale === "es" ? resource.es : resource.en;
                return (
                  <motion.div
                    key={resource._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <GradientCard tilt={false} className="h-full">
                      <FileText className="h-8 w-8 text-lake mb-4" />
                      <h2 className="font-display text-xl text-midnight mb-2">{content.title}</h2>
                      <p className="text-slate/75 text-sm mb-4">{content.description}</p>
                      <p className="font-label text-xs uppercase tracking-wider text-copper">
                        {t("download")}
                      </p>
                    </GradientCard>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="mt-16 max-w-xl mx-auto">
            <GradientCard tilt={false}>
              <LeadForm source="resources-page" />
            </GradientCard>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
