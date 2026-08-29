import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createPageMetadata } from "@/lib/metadata";
import { CalculatorsIndexContent } from "@/components/pages/CalculatorsIndexContent";

type Props = { params: Promise<{ locale: "en" | "es" }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.calculators" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/calculators",
    locale,
  });
}

export default async function CalculatorsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CalculatorsIndexContent />;
}
