"use client";

import { useLocale } from "next-intl";
import { Calendar, Phone } from "lucide-react";
import { useSiteConfig } from "@/lib/site-context";
import { useLabels } from "@/lib/labels";
import { Button } from "@/components/ui/Button";

export function MobileCTA() {
  const siteConfig = useSiteConfig();
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 box-border w-full max-w-full overflow-hidden p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none lg:hidden">
      <div className="pointer-events-auto mx-auto flex w-full min-w-0 max-w-lg gap-2 rounded-2xl border border-champagne/15 bg-midnight/95 p-2 shadow-2xl shadow-midnight/40 backdrop-blur-xl">
        <a
          href={siteConfig.phoneHref}
          className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-slate py-3 text-xs font-semibold text-ivory transition-colors hover:bg-slate/80 sm:text-sm"
        >
          <Phone className="h-4 w-4 shrink-0 text-copper" />
          <span className="truncate">{t("nav.call")}</span>
        </a>
        <Button href="/booking" size="sm" className="min-w-0 flex-1 justify-center text-xs sm:text-sm" magnetic>
          <Calendar className="h-4 w-4 shrink-0" />
          <span className="truncate">{t("nav.bookConsultation")}</span>
        </Button>
      </div>
    </div>
  );
}
