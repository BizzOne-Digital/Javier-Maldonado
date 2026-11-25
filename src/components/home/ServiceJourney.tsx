"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Home, Key, LineChart, Users } from "lucide-react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { useLabels } from "@/lib/labels";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { cn } from "@/lib/utils";

const panels = [
  { id: "discover", icon: Home, stat: 1, suffix: "", href: "/buy" },
  { id: "plan", icon: LineChart, stat: 4, suffix: "+", href: "/calculators/mortgage" },
  { id: "execute", icon: Key, stat: 3, suffix: "", href: "/sell" },
  { id: "grow", icon: Users, stat: 5, suffix: "", href: "/invest" },
] as const;

export function ServiceJourney() {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const panel = panels[active];

  return (
    <section className="py-24 md:py-32 bg-ivory overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow={t("home.serviceJourney")}
          title={t("journey.title")}
          subtitle={t("journey.subtitle")}
          singleLine
          className="mb-16"
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-3">
            {panels.map((p, i) => {
              const Icon = p.icon;
              const isActive = active === i;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "w-full text-left p-5 rounded-2xl border transition-all duration-300",
                    isActive
                      ? "border-lake/40 bg-gradient-to-r from-lake/5 to-copper/5 shadow-lg"
                      : "border-transparent hover:border-champagne/40 hover:bg-champagne/5"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                        isActive ? "bg-copper text-ivory" : "bg-champagne/30 text-slate"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-display text-xl text-midnight">
                        {t(`journey.${p.id}Title`)}
                      </p>
                      {!isActive && (
                        <p className="text-sm text-slate/60 line-clamp-1">
                          {t(`journey.${p.id}Desc`)}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative min-h-[320px] rounded-3xl overflow-hidden gradient-navy-lake p-8 md:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,121,69,0.3),transparent_60%)]" />
            <AnimatePresence mode="wait">
              <motion.div
                key={panel.id}
                initial={reducedMotion ? false : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="relative z-10"
              >
                <p className="font-display text-6xl md:text-7xl text-ivory/20 mb-4">
                  <AnimatedCounter value={panel.stat} suffix={panel.suffix} />
                </p>
                <h3 className="font-display text-3xl text-ivory mb-4">
                  {t(`journey.${panel.id}Title`)}
                </h3>
                <p className="text-champagne/80 leading-relaxed mb-8 max-w-md">
                  {t(`journey.${panel.id}Desc`)}
                </p>
                <Link
                  href={panel.href}
                  className="inline-flex items-center gap-2 text-copper hover:text-champagne transition-colors font-label uppercase tracking-wider text-sm"
                >
                  {t("journey.learnMore")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
