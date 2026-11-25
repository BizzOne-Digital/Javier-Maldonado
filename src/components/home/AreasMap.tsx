"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useSiteConfig } from "@/lib/site-context";
import { useLabels } from "@/lib/labels";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const cityPositions: Record<string, { cx: number; cy: number }> = {
  Etobicoke: { cx: 180, cy: 140 },
  Mississauga: { cx: 120, cy: 200 },
  Milton: { cx: 80, cy: 260 },
  Brampton: { cx: 200, cy: 220 },
  Oakville: { cx: 140, cy: 280 },
};

export function AreasMap() {
  const siteConfig = useSiteConfig();
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="py-24 md:py-32 bg-ivory">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="GTA"
          title={t("home.areasWeServe")}
          subtitle={
            locale === "es"
              ? "Especialista en las comunidades del oeste del GTA."
              : "Specialist in west GTA communities."
          }
          singleLine
          className="mb-16"
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden bg-midnight p-8 aspect-square max-h-[480px]">
            <div className="absolute inset-0 bg-gradient-to-br from-slate to-midnight" />
            <svg viewBox="0 0 320 360" className="relative w-full h-full" aria-label="GTA service areas map">
              <defs>
                <radialGradient id="map-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#327C9A" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#327C9A" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse cx="160" cy="200" rx="140" ry="120" fill="url(#map-glow)" />
              <path
                d="M40 120 Q80 80 160 90 Q240 100 280 140 L300 280 Q200 320 80 300 Z"
                fill="rgba(50,124,154,0.15)"
                stroke="rgba(232,215,184,0.3)"
                strokeWidth="1"
              />
              {siteConfig.serviceAreas.map((city) => {
                const pos = cityPositions[city];
                const isHovered = hovered === city;
                return (
                  <g key={city}>
                    <motion.circle
                      cx={pos.cx}
                      cy={pos.cy}
                      r={isHovered ? 14 : 10}
                      fill={isHovered ? "#C87945" : "#327C9A"}
                      className="cursor-pointer"
                      onMouseEnter={() => setHovered(city)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => router.push(`/listings?city=${encodeURIComponent(city)}`)}
                      animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
                      role="button"
                      tabIndex={0}
                      aria-label={city}
                    />
                    {isHovered && (
                      <motion.text
                        x={pos.cx}
                        y={pos.cy - 20}
                        textAnchor="middle"
                        fill="#E8D7B8"
                        fontSize="12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {city}
                      </motion.text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="space-y-4">
            {siteConfig.serviceAreas.map((city, i) => (
              <motion.button
                key={city}
                type="button"
                onClick={() => router.push(`/listings?city=${encodeURIComponent(city)}`)}
                onMouseEnter={() => setHovered(city)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  "w-full text-left p-5 rounded-2xl border transition-all",
                  hovered === city
                    ? "border-copper bg-copper/5 shadow-lg"
                    : "border-champagne/30 hover:border-lake/40"
                )}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <p className="font-display text-2xl text-midnight">{city}</p>
                <p className="text-sm text-slate/60 mt-1">
                  {locale === "es" ? "Ver propiedades" : "View listings"} →
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
