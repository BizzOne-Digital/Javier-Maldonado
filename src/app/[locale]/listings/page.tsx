import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createPageMetadata } from "@/lib/metadata";
import { getPublishedListings } from "@/lib/data";
import { ListingsPageContent } from "@/components/pages/ListingsPageContent";

type Props = { params: Promise<{ locale: "en" | "es" }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.listings" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/listings",
    locale,
  });
}

export default async function ListingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const listings = await getPublishedListings();
  return <ListingsPageContent listings={listings} />;
}
