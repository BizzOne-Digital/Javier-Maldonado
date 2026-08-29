"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageHero } from "@/components/ui/PageHero";
import { PageTransition } from "@/components/ui/PageTransition";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GradientCard } from "@/components/ui/GradientCard";
import { Button } from "@/components/ui/Button";
import { LeadForm } from "@/components/forms/LeadForm";

type ServiceKey = "buy" | "sell" | "rent" | "invest";

interface ServicePageContentProps {
  serviceKey: ServiceKey;
}

export function ServicePageContent({ serviceKey }: ServicePageContentProps) {
  const t = useTranslations(`pages.${serviceKey}`);
  const steps = t.raw("steps") as string[];
  const highlights = t.raw("highlights") as string[];

  return (
    <PageTransition>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <SectionHeading
                eyebrow={t("approachEyebrow")}
                title={t("approachTitle")}
                subtitle={t("approachSubtitle")}
              />
              <ul className="mt-10 space-y-4">
                {highlights.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3 text-slate/85"
                  >
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lake/15 text-lake">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </motion.li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button href="/booking" size="lg" magnetic>
                  {t("ctaPrimary")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/contact" variant="outline" size="lg">
                  {t("ctaSecondary")}
                </Button>
              </div>
            </div>

            <GradientCard tilt={false}>
              <h3 className="font-label text-xs uppercase tracking-wider text-lake mb-6">
                {t("processTitle")}
              </h3>
              <ol className="space-y-6">
                {steps.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="font-display text-3xl text-copper/40 leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-slate/85 pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </GradientCard>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-midnight">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <SectionHeading
            eyebrow={t("formEyebrow")}
            title={t("formTitle")}
            subtitle={t("formSubtitle")}
            light
            align="center"
            className="mb-10"
          />
          <GradientCard tilt={false} className="max-w-xl mx-auto">
            <LeadForm source={`${serviceKey}-page`} />
          </GradientCard>
        </div>
      </section>
    </PageTransition>
  );
}
