import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createPageMetadata } from "@/lib/metadata";
import { LandTransferCalculator } from "@/components/calculators/LandTransferCalculator";
import { CalculatorPageShell } from "@/components/pages/CalculatorPageShell";

type Props = { params: Promise<{ locale: "en" | "es" }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.landTransferCalc" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/calculators/land-transfer-tax",
    locale,
  });
}

export default async function LandTransferTaxPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <CalculatorPageShell namespace="pages.landTransferCalc">
      <LandTransferCalculator />
    </CalculatorPageShell>
  );
}
