import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createPageMetadata } from "@/lib/metadata";
import { HomeWorthForm } from "@/components/calculators/HomeWorthForm";
import { CalculatorPageShell } from "@/components/pages/CalculatorPageShell";

type Props = { params: Promise<{ locale: "en" | "es" }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.homeWorthCalc" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/calculators/home-worth",
    locale,
  });
}

export default async function HomeWorthPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <CalculatorPageShell namespace="pages.homeWorthCalc">
      <HomeWorthForm />
    </CalculatorPageShell>
  );
}
