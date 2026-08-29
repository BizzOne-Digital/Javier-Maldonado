"use client";

import {
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  magnetic?: boolean;
  href?: string;
  children: ReactNode;
  className?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm min-h-[2.5rem]",
  md: "px-6 py-3 text-sm min-h-[2.75rem]",
  lg: "px-8 py-4 text-sm md:text-base min-h-[3.25rem]",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-copper via-champagne to-lake text-midnight font-semibold shadow-lg shadow-copper/20 hover:shadow-copper/40",
  secondary:
    "bg-slate text-ivory border border-champagne/20 hover:border-lake/50",
  ghost: "bg-transparent text-champagne hover:bg-champagne/10",
  outline:
    "bg-transparent border border-copper/40 text-copper hover:bg-copper/10",
};

function ButtonInner({
  variant,
  children,
}: {
  variant: ButtonVariant;
  children: ReactNode;
}) {
  return (
    <>
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-lake/0 via-white/20 to-copper/0 translate-x-[-100%] transition-transform duration-700 group-hover:translate-x-[100%]"
        />
      )}
      <span className="relative z-10 inline-flex items-center justify-center gap-2 text-center leading-none [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0">
        {children}
      </span>
    </>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  magnetic = false,
  href,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnetic || reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setOffset({ x: x * 0.15, y: y * 0.15 });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  const classes = cn(
    "group relative inline-flex items-center justify-center gap-2 rounded-full font-label uppercase tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lake focus-visible:ring-offset-2 focus-visible:ring-offset-midnight disabled:opacity-50 disabled:pointer-events-none overflow-hidden w-fit max-w-full",
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  const motionProps =
    magnetic && !reducedMotion
      ? {
          animate: { x: offset.x, y: offset.y },
          transition: { type: "spring" as const, stiffness: 300, damping: 20 },
        }
      : {};

  if (href) {
    return (
      <motion.span
        className="inline-flex w-fit max-w-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...motionProps}
      >
        <Link href={href} className={classes}>
          <ButtonInner variant={variant}>{children}</ButtonInner>
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      className={classes}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      {...motionProps}
      {...(props as object)}
    >
      <ButtonInner variant={variant}>{children}</ButtonInner>
    </motion.button>
  );
}
