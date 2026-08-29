"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageHero } from "@/components/ui/PageHero";
import { PageTransition } from "@/components/ui/PageTransition";
import { GradientCard } from "@/components/ui/GradientCard";

interface TestimonialItem {
  _id: string;
  name: string;
  location?: string;
  rating?: number;
  en: { quote: string };
  es: { quote: string };
}

interface TestimonialsPageContentProps {
  testimonials: TestimonialItem[];
}

export function TestimonialsPageContent({ testimonials }: TestimonialsPageContentProps) {
  const locale = useLocale();
  const t = useTranslations("pages.testimonials");
  const common = useTranslations("common");

  return (
    <PageTransition>
      <PageHero
        eyebrow={t("metaTitle")}
        title={t("metaTitle")}
        subtitle={t("metaDescription")}
        compact
      />

      <section className="py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {testimonials.length === 0 ? (
            <p className="text-center text-slate/70 py-16 text-lg">{common("emptyTestimonials")}</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {testimonials.map((item, i) => {
                const quote = locale === "es" ? item.es.quote : item.en.quote;
                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <GradientCard tilt={false} className="h-full">
                      <Quote className="h-8 w-8 text-copper/60 mb-4" />
                      <blockquote className="text-slate/85 leading-relaxed mb-6">
                        &ldquo;{quote}&rdquo;
                      </blockquote>
                      <footer>
                        <p className="font-semibold text-midnight">{item.name}</p>
                        {item.location && (
                          <p className="text-sm text-slate/60">{item.location}</p>
                        )}
                      </footer>
                    </GradientCard>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
