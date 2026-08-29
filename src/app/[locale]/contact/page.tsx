import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createPageMetadata } from "@/lib/metadata";
import { ContactPageContent } from "@/components/pages/ContactPageContent";

type Props = { params: Promise<{ locale: "en" | "es" }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.contact" });
  const contact = await getTranslations({ locale, namespace: "contact" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: contact("subtitle"),
    path: "/contact",
    locale,
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactPageContent />;
}
