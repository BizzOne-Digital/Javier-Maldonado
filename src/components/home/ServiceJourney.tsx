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
  {
    id: "discover",
    icon: Home,
    titleEn: "Discover",
    titleEs: "Descubrir",
    descEn: "Explore neighbourhoods, market trends, and properties aligned with your lifestyle.",
    descEs: "Explore vecindarios, tendencias del mercado y propiedades acordes a su estilo de vida.",
    stat: 1,
    suffix: "",
    href: "/services/buying",
  },
  {
    id: "plan",
    icon: LineChart,
    titleEn: "Plan",
    titleEs: "Planificar",
    descEn: "Use calculators and strategy sessions to understand costs and financing.",
    descEs: "Use calculadoras y sesiones estratégicas para entender costos y financiamiento.",
    stat: 4,
    suffix: "+",
    href: "/calculators/mortgage",
  },
  {
    id: "execute",
    icon: Key,
    titleEn: "Execute",
    titleEs: "Ejecutar",
    descEn: "Negotiate, inspect, and close with a trusted advisor at every step.",
    descEs: "Negocie, inspeccione y cierre con un asesor de confianza en cada paso.",
    stat: 3,
    suffix: "",
    href: "/services/selling",
  },
  {
    id: "grow",
    icon: Users,
    titleEn: "Grow",
    titleEs: "Crecer",
    descEn: "Build wealth through investment properties and long-term portfolio planning.",
    descEs: "Construya patrimonio con propiedades de inversión y planificación a largo plazo.",
    stat: 5,
    suffix: "",
    href: "/services/investing",
  },
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
          title={locale === "es" ? "Cuatro etapas hacia su meta" : "Four stages to your goal"}
          subtitle={
            locale === "es"
              ? "Un recorrido guiado para compradores, vendedores e inversionistas."
              : "A guided path for buyers, sellers, and investors."
          }
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
                        {locale === "es" ? p.titleEs : p.titleEn}
                      </p>
                      {!isActive && (
                        <p className="text-sm text-slate/60 line-clamp-1">
                          {locale === "es" ? p.descEs : p.descEn}
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
                  {locale === "es" ? panel.titleEs : panel.titleEn}
                </h3>
                <p className="text-champagne/80 leading-relaxed mb-8 max-w-md">
                  {locale === "es" ? panel.descEs : panel.descEn}
                </p>
                <Link
                  href={panel.href}
                  className="inline-flex items-center gap-2 text-copper hover:text-champagne transition-colors font-label uppercase tracking-wider text-sm"
                >
                  {locale === "es" ? "Saber más" : "Learn more"}
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
