import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { createPageMetadata } from "@/lib/metadata";
import { getServiceBySlug } from "@/lib/data";
import { ServiceDetailContent } from "@/components/pages/ServicesContent";

type Props = { params: Promise<{ locale: "en" | "es"; slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  const c = locale === "es" && service.es?.title ? service.es : service.en;
  return createPageMetadata({
    title: c?.title || slug,
    description: c?.description || "",
    path: `/services/${slug}`,
    locale,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = await getServiceBySlug(slug);
  if (!service) notFound();
  return <ServiceDetailContent service={service} />;
}
