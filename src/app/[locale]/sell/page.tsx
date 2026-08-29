import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createPageMetadata } from "@/lib/metadata";
import { ServicePageContent } from "@/components/pages/ServicePageContent";

type Props = { params: Promise<{ locale: "en" | "es" }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.sell" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/sell",
    locale,
  });
}

export default async function SellPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicePageContent serviceKey="sell" />;
}
