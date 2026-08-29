"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SkylineSvg } from "@/components/ui/SkylineSvg";
import { cn } from "@/lib/utils";

const INTRO_KEY = "jm-intro-seen";
const INTRO_DURATION = 2800;

interface IntroExperienceProps {
  onComplete?: () => void;
}

export function IntroExperience({ onComplete }: IntroExperienceProps) {
  const t = useTranslations("intro");
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  const finish = useCallback(() => {
    sessionStorage.setItem(INTRO_KEY, "1");
    setExiting(true);
    window.setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, reducedMotion ? 0 : 700);
  }, [onComplete, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      finish();
      return;
    }

    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      setProgress(Math.min(elapsed / INTRO_DURATION, 1));
      if (elapsed >= INTRO_DURATION) {
        finish();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [finish, reducedMotion]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [finish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[#0A192F]"
          role="dialog"
          aria-modal="true"
          aria-label={t("tagline")}
          initial={{ opacity: 1 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.6 }}
        >
          <div className="absolute inset-0 gradient-hero opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,121,69,0.18),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(50,124,154,0.2),transparent_45%)]" />

          {/* Light trail */}
          <motion.div
            className="absolute top-1/2 left-0 right-0 h-px light-trail"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />

          {/* Curtain reveal exit */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 bg-[#0A192F]"
            initial={{ scaleY: 0, transformOrigin: "top" }}
            animate={exiting ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          />

          <div className="relative z-10 flex flex-col items-center gap-10 px-6 text-center">
            {/* Logo — same style as header, larger */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-lake/25 via-copper/35 to-lake/25 blur-3xl" />
              <Image
                src="/logo.png"
                alt={`${siteConfig.name} Real Estate`}
                width={360}
                height={108}
                priority
                className="relative h-20 w-auto object-contain sm:h-24 md:h-28 lg:h-32 xl:h-36"
              />
            </motion.div>

            {/* Name & tagline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="space-y-2"
            >
              <p className="font-display text-2xl text-white sm:text-3xl md:text-4xl">
                {t("name")}
              </p>
              <p className="font-label text-xs uppercase tracking-[0.35em] text-copper sm:text-sm">
                {t("tagline")}
              </p>
            </motion.div>

            {/* Skyline */}
            <motion.div
              className="w-full max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.9 }}
            >
              <SkylineSvg variant="light" className="opacity-90" />
            </motion.div>
          </div>

          {/* Progress + skip */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center gap-4 p-8">
            <div className="h-0.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-copper via-champagne to-lake"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <button
              type="button"
              onClick={finish}
              className={cn(
                "rounded px-4 py-1.5 font-label text-xs uppercase tracking-[0.2em] text-champagne/70",
                "transition-colors hover:text-copper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lake"
              )}
            >
              {t("skip")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
