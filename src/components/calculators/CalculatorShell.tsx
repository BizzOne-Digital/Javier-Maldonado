"use client";

import { type ReactNode } from "react";
import { Printer, RotateCcw } from "lucide-react";
import { useLocale } from "next-intl";
import { siteConfig } from "@/config/site";
import { useLabels } from "@/lib/labels";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GradientCard } from "@/components/ui/GradientCard";
import { cn } from "@/lib/utils";

interface CalculatorShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  results?: ReactNode;
  onReset?: () => void;
  className?: string;
}

export function CalculatorShell({
  title,
  subtitle,
  children,
  results,
  onReset,
  className,
}: CalculatorShellProps) {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");

  const handlePrint = () => window.print();

  return (
    <div className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading title={title} subtitle={subtitle} className="mb-10" />

        <div className="flex flex-wrap gap-3 mb-8 print:hidden">
          {onReset && (
            <Button variant="outline" size="sm" onClick={onReset}>
              <RotateCcw className="w-4 h-4" />
              {t("calculators_ui.reset")}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
            {t("calculators_ui.print")}
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <GradientCard tilt={false}>
            <h3 className="font-label text-xs uppercase tracking-wider text-lake mb-6">
              {t("calculators_ui.inputs")}
            </h3>
            {children}
          </GradientCard>

          {results && (
            <GradientCard tilt={false} glow>
              <h3 className="font-label text-xs uppercase tracking-wider text-copper mb-6">
                {t("calculators_ui.results")}
              </h3>
              {results}
            </GradientCard>
          )}
        </div>

        <div className="mt-10 p-6 rounded-2xl bg-champagne/20 border border-champagne/30 print:break-before-page">
          <p className="font-label text-xs uppercase tracking-wider text-slate mb-2">
            {t("calculators_ui.disclaimer")}
          </p>
          <p className="text-sm text-slate/70 leading-relaxed">{siteConfig.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
