import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createPageMetadata } from "@/lib/metadata";
import { AreasPageContent } from "@/components/pages/AreasPageContent";

type Props = { params: Promise<{ locale: "en" | "es" }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.areas" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/areas",
    locale,
  });
}

export default async function AreasPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AreasPageContent />;
}
