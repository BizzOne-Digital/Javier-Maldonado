"use client";

import { useLocale } from "next-intl";
import { useLabels } from "@/lib/labels";
import { HomeValueForm } from "@/components/forms/HomeValueForm";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function HomeWorthForm() {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");

  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        <SectionHeading
          title={t("calculators.homeWorth")}
          subtitle={
            locale === "es"
              ? "Reciba un análisis de mercado personalizado — sin estimaciones automáticas en línea."
              : "Receive a personalized market analysis — no automated online estimates."
          }
          className="mb-10"
        />
        <HomeValueForm />
      </div>
    </div>
  );
}
