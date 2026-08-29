"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { PageHero } from "@/components/ui/PageHero";
import { PageTransition } from "@/components/ui/PageTransition";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const t = useTranslations("pages.notFound");

  return (
    <PageTransition>
      <PageHero title={t("title")} subtitle={t("subtitle")} compact />
      <section className="py-16 bg-ivory text-center">
        <div className="mx-auto max-w-md px-4">
          <Button href="/" size="lg" magnetic>
            {t("cta")}
          </Button>
          <p className="mt-6 text-sm text-slate/60">
            <Link href="/contact" className="text-lake hover:text-copper transition-colors">
              Contact
            </Link>
          </p>
        </div>
      </section>
    </PageTransition>
  );
}
