import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createPageMetadata } from "@/lib/metadata";
import { getListingBySlug } from "@/lib/data";
import { ListingDetailContent } from "@/components/pages/ListingDetailContent";

type Props = { params: Promise<{ locale: "en" | "es"; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const listing = await getListingBySlug(slug);
  const t = await getTranslations({ locale, namespace: "pages.listingDetail" });

  if (!listing) {
    return createPageMetadata({
      title: t("notFound"),
      description: t("notFoundBody"),
      path: `/listings/${slug}`,
      locale,
      noIndex: true,
    });
  }

  const content = locale === "es" ? listing.es : listing.en;
  return createPageMetadata({
    title: content.title || listing.address,
    description: content.description || t("metaDescription"),
    path: `/listings/${slug}`,
    locale,
  });
}

export default async function ListingDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();
  return <ListingDetailContent listing={listing} />;
}
