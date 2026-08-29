import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createPageMetadata } from "@/lib/metadata";
import { getPublishedTestimonials } from "@/lib/data";
import { TestimonialsPageContent } from "@/components/pages/TestimonialsPageContent";

type Props = { params: Promise<{ locale: "en" | "es" }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.testimonials" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/testimonials",
    locale,
  });
}

export default async function TestimonialsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const testimonials = await getPublishedTestimonials();
  return <TestimonialsPageContent testimonials={testimonials} />;
}
