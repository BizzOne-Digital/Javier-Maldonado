"use client";

import { motion } from "framer-motion";
import { Award, Globe, MapPin } from "lucide-react";
import { useLocale } from "next-intl";
import { useLabels } from "@/lib/labels";

const items = [
  { icon: Award, labelKey: "home.trustLicensed" },
  { icon: MapPin, labelKey: "home.trustLocal" },
  { icon: Globe, labelKey: "home.trustBilingual" },
] as const;

export function TrustBar() {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");

  return (
    <section className="relative z-10 w-full max-w-full overflow-hidden px-4 pb-10 md:px-6 md:pb-14">
      <motion.div
        className="mx-auto max-w-5xl rounded-2xl bg-ivory border border-champagne/30 shadow-xl shadow-midnight/5 p-6 md:p-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid gap-6 md:grid-cols-3 md:divide-x divide-champagne/20">
          {items.map(({ icon: Icon, labelKey }, i) => (
            <motion.div
              key={labelKey}
              className="flex min-w-0 items-center gap-4 first:pl-0 last:pr-0 md:px-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-lake/20 to-copper/20 text-copper">
                <Icon className="w-5 h-5" />
              </div>
              <p className="min-w-0 break-words font-label text-sm uppercase tracking-wider text-midnight">
                {t(labelKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
