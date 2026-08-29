"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { PageHero } from "@/components/ui/PageHero";
import { PageTransition } from "@/components/ui/PageTransition";
import { ContactForm } from "@/components/forms/ContactForm";
import { GradientCard } from "@/components/ui/GradientCard";

export function ContactPageContent() {
  const contact = useTranslations("contact");

  return (
    <PageTransition>
      <PageHero
        eyebrow={contact("title")}
        title={contact("title")}
        subtitle={contact("subtitle")}
        compact
      />

      <section className="py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <ContactForm />

            <div className="space-y-6">
              <GradientCard tilt={false}>
                <h2 className="font-display text-2xl text-midnight mb-6">
                  {siteConfig.name}
                </h2>
                <ul className="space-y-4 text-slate/85">
                  <li className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-copper shrink-0 mt-0.5" />
                    <span>{siteConfig.address.full}</span>
                  </li>
                  <li>
                    <a
                      href={siteConfig.phoneHref}
                      className="flex items-center gap-3 hover:text-copper transition-colors"
                    >
                      <Phone className="h-5 w-5 text-copper" />
                      {siteConfig.phone}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="flex items-center gap-3 hover:text-copper transition-colors"
                    >
                      <Mail className="h-5 w-5 text-copper" />
                      {siteConfig.email}
                    </a>
                  </li>
                </ul>
                <p className="mt-6 text-sm text-slate/60">{siteConfig.brokerage}</p>
              </GradientCard>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
