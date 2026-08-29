"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import { useLabels } from "@/lib/labels";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative w-full max-w-full overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 gradient-navy-lake" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(200,121,69,0.25),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(50,124,154,0.3),transparent_50%)]" />

      {!reducedMotion && (
        <motion.div
          className="absolute top-1/2 left-1/2 h-[min(100vw,600px)] w-[min(100vw,600px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-champagne/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      )}

      <div className="relative mx-auto max-w-3xl px-4 md:px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 break-words font-display text-3xl text-ivory md:text-4xl lg:text-5xl xl:text-6xl 2xl:whitespace-nowrap"
        >
          {t("home.finalCta")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-champagne/80 mb-10"
        >
          {t("home.finalCtaSub")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button href="/booking" size="lg" magnetic>
            {t("nav.bookConsultation")}
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button href="/contact" variant="outline" size="lg">
            {t("nav.contact")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
