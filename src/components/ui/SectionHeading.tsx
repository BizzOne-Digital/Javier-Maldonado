"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  singleLine?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  light = false,
  singleLine = false,
  className,
}: SectionHeadingProps) {
  const reducedMotion = useReducedMotion();
  const words = title.split(" ");
  const midpoint = Math.ceil(words.length / 2);
  const line1 = words.slice(0, midpoint).join(" ");
  const line2 = words.slice(midpoint).join(" ");

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reducedMotion ? 0 : 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <motion.div
      className={cn(
        singleLine ? "max-w-none min-w-0" : "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {eyebrow && (
        <motion.p
          variants={item}
          className={cn(
            "font-label text-xs uppercase tracking-[0.25em] mb-4",
            light ? "text-champagne/70" : "text-lake"
          )}
        >
          {eyebrow}
        </motion.p>
      )}
      <h2
        className={cn(
          "font-display text-4xl leading-[1.05] break-words md:text-5xl lg:text-6xl",
          light ? "text-ivory" : "text-midnight"
        )}
      >
        {singleLine ? (
          <motion.span variants={item} className="block 2xl:whitespace-nowrap">
            {title}
          </motion.span>
        ) : (
          <>
            <motion.span variants={item} className="block">
              {line1}
            </motion.span>
            {line2 && (
              <motion.span variants={item} className="block gradient-text">
                {line2}
              </motion.span>
            )}
          </>
        )}
      </h2>
      {subtitle && (
        <motion.p
          variants={item}
          className={cn(
            "mt-5 text-lg leading-relaxed",
            light ? "text-champagne/80" : "text-slate/80"
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
