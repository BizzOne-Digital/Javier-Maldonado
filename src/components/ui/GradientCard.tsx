"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface GradientCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  glow?: boolean;
}

export function GradientCard({
  children,
  className,
  tilt = true,
  glow = true,
}: GradientCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMove = (e: MouseEvent) => {
    if (!tilt || reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("group relative overflow-hidden perspective-[1000px]", className)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={
        tilt && !reducedMotion
          ? { rotateX, rotateY, transformStyle: "preserve-3d" }
          : undefined
      }
      whileHover={reducedMotion ? undefined : { scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {glow && (
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-lake via-copper to-champagne opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
      )}
      <div className="gradient-border relative flex h-full min-h-[200px] flex-col rounded-2xl bg-ivory/95 p-6 shadow-xl shadow-midnight/5 backdrop-blur-sm md:min-h-[220px] md:p-8">
        {children}
      </div>
    </motion.div>
  );
}
