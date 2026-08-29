"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calculator, Home, Landmark, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { PageHero } from "@/components/ui/PageHero";
import { PageTransition } from "@/components/ui/PageTransition";
import { GradientCard } from "@/components/ui/GradientCard";

const calculators = [
  { href: "/calculators/mortgage", titleKey: "mortgageTitle", key: "mortgageDesc", icon: Calculator },
  { href: "/calculators/purchase", titleKey: "purchaseTitle", key: "purchaseDesc", icon: Landmark },
  { href: "/calculators/cmhc", titleKey: "cmhcTitle", key: "cmhcDesc", icon: Shield },
  { href: "/calculators/land-transfer-tax", titleKey: "landTransferTitle", key: "landTransferDesc", icon: Landmark },
  { href: "/calculators/home-worth", titleKey: "homeWorthTitle", key: "homeWorthDesc", icon: Home },
] as const;

export function CalculatorsIndexContent() {
  const t = useTranslations("pages.calculators");

  return (
    <PageTransition>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} compact />

      <section className="py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {calculators.map(({ href, titleKey, key, icon: Icon }, i) => (
              <motion.div
                key={href}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={href} className="block h-full">
                  <GradientCard tilt={false} className="h-full group cursor-pointer">
                    <div className="flex h-full flex-col">
                      <Icon className="mb-4 h-8 w-8 shrink-0 text-lake" />
                      <h3 className="mb-2 font-display text-xl text-midnight">
                        {t(titleKey)}
                      </h3>
                      <p className="mb-6 flex-1 text-sm leading-relaxed text-slate/85 md:text-base">
                        {t(key)}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-2 font-label text-xs uppercase tracking-wider text-copper transition-colors group-hover:text-lake">
                        Open
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </GradientCard>
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="mt-12 max-w-3xl text-sm text-slate/60">{siteConfig.disclaimer}</p>
        </div>
      </section>
    </PageTransition>
  );
}
