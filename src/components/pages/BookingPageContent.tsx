"use client";

import { useTranslations } from "next-intl";
import { PageHero } from "@/components/ui/PageHero";
import { PageTransition } from "@/components/ui/PageTransition";
import { BookingForm } from "@/components/forms/BookingForm";

export function BookingPageContent() {
  const t = useTranslations("pages.booking");
  const common = useTranslations("common");

  return (
    <PageTransition>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} compact />

      <section className="py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-xl px-4 md:px-6">
          <BookingForm />
          <p className="mt-6 text-sm text-slate/60 text-center">{common("bookingNote")}</p>
        </div>
      </section>
    </PageTransition>
  );
}
