import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import {
  Barlow_Condensed,
  Instrument_Serif,
  Manrope,
} from "next/font/google";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { Providers } from "@/components/providers/Providers";
import { IntroGate } from "@/components/providers/IntroGate";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCTA } from "@/components/layout/MobileCTA";
import { RealEstateAgentJsonLd } from "@/components/seo/JsonLd";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: {
      default: t("siteTitle"),
      template: `%s | ${siteConfig.title}`,
    },
    description: t("siteDescription"),
    metadataBase: new URL(siteConfig.domain),
    openGraph: {
      title: t("siteTitle"),
      description: t("siteDescription"),
      url: `${siteConfig.domain}/${locale}`,
      siteName: siteConfig.title,
      locale: locale === "es" ? "es_CA" : "en_CA",
      type: "website",
    },
    alternates: {
      canonical: `${siteConfig.domain}/${locale}`,
      languages: {
        en: `${siteConfig.domain}/en`,
        es: `${siteConfig.domain}/es`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "es")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <div
      className={`site-shell ${instrumentSerif.variable} ${manrope.variable} ${barlowCondensed.variable} flex min-h-full w-full max-w-full flex-col overflow-x-clip antialiased bg-ivory text-midnight`}
    >
      <NextIntlClientProvider messages={messages}>
        <RealEstateAgentJsonLd />
        <Providers>
          <IntroGate>
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <Header />
            <main id="main" className="flex-1 w-full max-w-full overflow-x-clip pb-24 lg:pb-0">
              {children}
            </main>
            <Footer />
            <MobileCTA />
          </IntroGate>
        </Providers>
      </NextIntlClientProvider>
    </div>
  );
}
