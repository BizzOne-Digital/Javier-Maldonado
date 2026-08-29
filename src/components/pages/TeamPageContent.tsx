"use client";

import { ContentImage } from "@/components/ui/ContentImage";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageHero } from "@/components/ui/PageHero";
import { PageTransition } from "@/components/ui/PageTransition";
import { GradientCard } from "@/components/ui/GradientCard";

interface TeamMemberItem {
  _id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  headshot?: string;
  en: { bio: string };
  es: { bio: string };
}

interface TeamPageContentProps {
  team: TeamMemberItem[];
}

export function TeamPageContent({ team }: TeamPageContentProps) {
  const locale = useLocale();
  const t = useTranslations("pages.team");

  return (
    <PageTransition>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} compact />

      <section className="py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {team.length === 0 ? (
            <p className="text-center text-slate/70 py-16 text-lg">{t("empty")}</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member, i) => {
                const bio = locale === "es" ? member.es.bio : member.en.bio;
                return (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <GradientCard tilt={false} className="h-full text-center">
                      <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border border-champagne/30">
                        {member.headshot ? (
                          <ContentImage
                            src={member.headshot}
                            alt={member.name}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        ) : (
                          <div className="absolute inset-0 gradient-hero" />
                        )}
                      </div>
                      <h2 className="font-display text-2xl text-midnight mb-1">{member.name}</h2>
                      <p className="font-label text-xs uppercase tracking-wider text-lake mb-4">
                        {member.role}
                      </p>
                      <p className="text-slate/80 text-sm leading-relaxed mb-4">{bio}</p>
                      <div className="flex flex-col gap-2 text-sm">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="inline-flex items-center justify-center gap-2 text-slate/70 hover:text-copper transition-colors"
                          >
                            <Mail className="h-4 w-4" />
                            {member.email}
                          </a>
                        )}
                        {member.phone && (
                          <a
                            href={`tel:${member.phone}`}
                            className="inline-flex items-center justify-center gap-2 text-slate/70 hover:text-copper transition-colors"
                          >
                            <Phone className="h-4 w-4" />
                            {member.phone}
                          </a>
                        )}
                      </div>
                    </GradientCard>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
