"use client";

import { motion } from "framer-motion";
import { Calculator, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { useLabels } from "@/lib/labels";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GradientCard } from "@/components/ui/GradientCard";

const calculators = [
  { href: "/calculators/mortgage", labelKey: "calculators.mortgage", descEn: "Estimate monthly payments", descEs: "Estime pagos mensuales" },
  { href: "/calculators/purchase", labelKey: "calculators.purchase", descEn: "Total cash to close", descEs: "Efectivo total al cierre" },
  { href: "/calculators/cmhc", labelKey: "calculators.cmhc", descEn: "Insurance premium estimate", descEs: "Estimación de prima CMHC" },
  { href: "/calculators/land-transfer", labelKey: "calculators.landTransfer", descEn: "Ontario & Toronto LTT", descEs: "Impuesto de transferencia ON/TO" },
] as const;

export function CalculatorPreview() {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ivory via-champagne/20 to-ivory" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow={t("nav.calculators")}
          title={t("home.calculatorPreview")}
          subtitle={
            locale === "es"
              ? "Herramientas transparentes para planificar su compra con confianza."
              : "Transparent tools to plan your purchase with confidence."
          }
          singleLine
          className="mb-16"
        />

        <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2">
          {calculators.map((calc, i) => (
            <motion.div
              key={calc.href}
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={calc.href} className="block h-full">
                <GradientCard className="h-full transition-shadow hover:shadow-2xl">
                  <div className="flex h-full flex-col">
                    <div className="mb-4 flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-lake/20 to-copper/20 text-copper">
                        <Calculator className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-1 font-display text-xl text-midnight">
                          {t(calc.labelKey)}
                        </h3>
                        <p className="text-sm leading-relaxed text-slate/70">
                          {locale === "es" ? calc.descEs : calc.descEn}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="mt-auto ml-auto h-5 w-5 shrink-0 text-lake" />
                  </div>
                </GradientCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
