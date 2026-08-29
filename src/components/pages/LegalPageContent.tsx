"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { PageHero } from "@/components/ui/PageHero";
import { PageTransition } from "@/components/ui/PageTransition";
import { GradientCard } from "@/components/ui/GradientCard";

interface LegalPageContentProps {
  namespace: "pages.privacy" | "pages.terms";
}

export function LegalPageContent({ namespace }: LegalPageContentProps) {
  const t = useTranslations(namespace);
  const sections = t.raw("sections") as { heading: string; body: string }[];

  return (
    <PageTransition>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} compact />

      <section className="py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-3xl px-4 md:px-6 space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.heading}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <GradientCard tilt={false}>
                <h2 className="font-display text-xl text-midnight mb-3">{section.heading}</h2>
                <p className="text-slate/85 leading-relaxed">{section.body}</p>
              </GradientCard>
            </motion.div>
          ))}

          <p className="text-sm text-slate/60 text-center pt-4">{siteConfig.disclaimer}</p>
        </div>
      </section>
    </PageTransition>
  );
}
