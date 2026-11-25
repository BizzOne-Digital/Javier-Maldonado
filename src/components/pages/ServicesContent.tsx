"use client";

import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ContentImage } from "@/components/ui/ContentImage";
import { PageHero } from "@/components/ui/PageHero";
import { PageTransition } from "@/components/ui/PageTransition";
import { GradientCard } from "@/components/ui/GradientCard";
import { Button } from "@/components/ui/Button";
import { LeadForm } from "@/components/forms/LeadForm";
import { useLabels } from "@/lib/labels";
import type { ServiceItem } from "@/lib/data";

function pick(service: ServiceItem, locale: string) {
  const primary = locale === "es" ? service.es : service.en;
  return {
    title: primary?.title || service.en?.title || service.slug,
    description: primary?.description || service.en?.description || "",
    content: primary?.content || service.en?.content || "",
  };
}

export function ServicesIndexContent({ services }: { services: ServiceItem[] }) {
  const locale = useLocale();
  const t = useTranslations("pages.services");
  const labels = useLabels(locale as "en" | "es");

  return (
    <PageTransition>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <section className="py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {services.length === 0 ? (
            <p className="text-center text-slate/70">{t("empty")}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const c = pick(service, locale);
                return (
                  <GradientCard key={service._id} tilt={false} className="h-full overflow-hidden">
                    {service.image && (
                      <div className="relative -mx-6 -mt-6 mb-5 aspect-[16/10] overflow-hidden">
                        <ContentImage
                          src={service.image}
                          alt={c.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 33vw, 100vw"
                        />
                      </div>
                    )}
                    <h2 className="font-display text-2xl text-midnight mb-2">{c.title}</h2>
                    <p className="text-sm text-slate/75 mb-4">{c.description}</p>
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-2 font-label text-xs uppercase tracking-wider text-copper hover:text-lake transition-colors"
                    >
                      {labels("journey.learnMore")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </GradientCard>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}

export function ServiceDetailContent({ service }: { service: ServiceItem }) {
  const locale = useLocale();
  const t = useTranslations("pages.services");
  const c = pick(service, locale);
  const paragraphs = c.content.split(/\n+/).filter((p) => p.trim());

  return (
    <PageTransition>
      <PageHero eyebrow={t("eyebrow")} title={c.title} subtitle={c.description} />
      <section className="py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          {service.image && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl shadow-xl shadow-midnight/10">
              <ContentImage
                src={service.image}
                alt={c.title}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 896px, 100vw"
              />
            </div>
          )}
          <div className="space-y-4 text-lg leading-relaxed text-slate/85">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/booking" size="lg" magnetic>
              {t("cta")}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/services" variant="outline" size="lg">
              {t("back")}
            </Button>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-midnight">
        <div className="mx-auto max-w-xl px-4 md:px-6">
          <GradientCard tilt={false}>
            <LeadForm source={`service-${service.slug}`} />
          </GradientCard>
        </div>
      </section>
    </PageTransition>
  );
}
