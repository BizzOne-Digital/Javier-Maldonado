"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  compact?: boolean;
  className?: string;
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  compact = false,
  className,
}: PageHeroProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-midnight",
        compact ? "pt-32 pb-16 md:pt-36 md:pb-20" : "pt-32 pb-20 md:pt-40 md:pb-28",
        className
      )}
    >
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(200,121,69,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_70%,rgba(50,124,154,0.22),transparent_50%)]" />

      {!reducedMotion && (
        <>
          <motion.div
            className="absolute top-1/3 left-1/5 w-72 h-72 rounded-full bg-lake/10 blur-3xl"
            animate={{ x: [0, 24, 0], y: [0, -16, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/5 w-64 h-64 rounded-full bg-copper/10 blur-3xl"
            animate={{ x: [0, -20, 0], y: [0, 12, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl px-4 md:px-6">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-label text-xs uppercase tracking-[0.3em] text-champagne/70 mb-5"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl break-words font-display text-4xl leading-[1.05] text-ivory md:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-5 text-lg md:text-xl text-champagne/80 max-w-2xl leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ivory to-transparent" />
    </section>
  );
}
