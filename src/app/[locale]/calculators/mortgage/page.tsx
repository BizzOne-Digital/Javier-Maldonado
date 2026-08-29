import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createPageMetadata } from "@/lib/metadata";
import { MortgageCalculator } from "@/components/calculators/MortgageCalculator";
import { CalculatorPageShell } from "@/components/pages/CalculatorPageShell";

type Props = { params: Promise<{ locale: "en" | "es" }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.mortgageCalc" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/calculators/mortgage",
    locale,
  });
}

export default async function MortgageCalculatorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <CalculatorPageShell namespace="pages.mortgageCalc">
      <MortgageCalculator />
    </CalculatorPageShell>
  );
}
