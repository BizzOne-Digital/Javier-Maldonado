"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface SkylineSvgProps {
  className?: string;
  animate?: boolean;
  variant?: "light" | "dark";
}

export function SkylineSvg({
  className,
  animate = true,
  variant = "dark",
}: SkylineSvgProps) {
  const reducedMotion = useReducedMotion();
  const stroke = variant === "light" ? "#E8D7B8" : "#327C9A";
  const fill = variant === "light" ? "rgba(232,215,184,0.15)" : "rgba(50,124,154,0.2)";

  const buildings = [
    { x: 0, w: 80, h: 120 },
    { x: 70, w: 60, h: 160 },
    { x: 120, w: 90, h: 100 },
    { x: 200, w: 70, h: 180 },
    { x: 260, w: 100, h: 140 },
    { x: 350, w: 80, h: 200 },
    { x: 420, w: 60, h: 130 },
    { x: 470, w: 110, h: 170 },
    { x: 570, w: 80, h: 110 },
    { x: 640, w: 60, h: 150 },
  ];

  return (
    <svg
      viewBox="0 0 700 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-auto", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="skyline-glow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#327C9A" stopOpacity="0" />
          <stop offset="50%" stopColor="#C87945" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#327C9A" stopOpacity="0" />
        </linearGradient>
      </defs>
      {buildings.map((b, i) => (
        <motion.rect
          key={i}
          x={b.x}
          y={220 - b.h}
          width={b.w}
          height={b.h}
          fill={fill}
          stroke={stroke}
          strokeWidth={1}
          initial={animate && !reducedMotion ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.6, ease: "easeOut" }}
        />
      ))}
      <motion.line
        x1="0"
        y1="220"
        x2="700"
        y2="220"
        stroke="url(#skyline-glow)"
        strokeWidth={2}
        initial={animate && !reducedMotion ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
    </svg>
  );
}
