"use client";

import { useTranslations } from "next-intl";
import { PageHero } from "@/components/ui/PageHero";
import { PageTransition } from "@/components/ui/PageTransition";

interface CalculatorPageShellProps {
  namespace: string;
  children: React.ReactNode;
}

export function CalculatorPageShell({ namespace, children }: CalculatorPageShellProps) {
  const t = useTranslations(namespace);

  return (
    <PageTransition>
      <PageHero
        eyebrow={t("metaTitle")}
        title={t("metaTitle")}
        subtitle={t("metaDescription")}
        compact
      />
      <div className="bg-ivory">{children}</div>
    </PageTransition>
  );
}
