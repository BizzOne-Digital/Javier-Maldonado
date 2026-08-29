"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/ui/SocialIcons";
import { Link } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { useLabels } from "@/lib/labels";

const footerLinks = [
  { href: "/listings", labelKey: "nav.listings" },
  { href: "/buy", labelKey: "services.buying" },
  { href: "/sell", labelKey: "services.selling" },
  { href: "/calculators/mortgage", labelKey: "calculators.mortgage" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/contact", labelKey: "nav.contact" },
  { href: "/booking", labelKey: "nav.bookConsultation" },
] as const;

export function Footer() {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full max-w-full overflow-hidden bg-midnight text-champagne">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(50,124,154,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-16 md:px-6 md:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt={`${siteConfig.name} Real Estate`}
                width={240}
                height={72}
                className="h-12 w-auto max-w-[70vw] object-contain sm:h-14 sm:max-w-none md:h-16 lg:h-[4.5rem]"
              />
            </Link>
            <p className="text-sm leading-relaxed text-champagne/70">
              {siteConfig.brokerage}
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-label text-xs uppercase tracking-[0.2em] text-lake">
              {t("footer.brokerage")}
            </h3>
            <ul className="space-y-3 text-sm text-champagne/80">
              <li className="flex min-w-0 items-start gap-2 break-words">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
                {siteConfig.address.full}
              </li>
              <li>
                <a
                  href={siteConfig.phoneHref}
                  className="flex items-center gap-2 transition-colors hover:text-copper"
                >
                  <Phone className="h-4 w-4 text-copper" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 transition-colors hover:text-copper"
                >
                  <Mail className="h-4 w-4 text-copper" />
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-label text-xs uppercase tracking-[0.2em] text-lake">
              {t("nav.services")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-champagne/80 transition-colors hover:text-copper"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-label text-xs uppercase tracking-[0.2em] text-lake">
              Social
            </h3>
            <div className="flex gap-3">
              {[
                { href: siteConfig.social.instagram, Icon: InstagramIcon },
                { href: siteConfig.social.facebook, Icon: FacebookIcon },
                { href: siteConfig.social.linkedin, Icon: LinkedinIcon },
              ].map(({ href, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-champagne/20 p-3 transition-all hover:border-copper hover:text-copper hover:shadow-lg hover:shadow-copper/20"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-champagne/10 pt-8 text-xs text-champagne/50 sm:flex-row">
          <p>
            © {year} {siteConfig.name}. {t("footer.rights")}
          </p>
          <p className="max-w-xl">{siteConfig.disclaimer.slice(0, 120)}…</p>
        </div>
      </div>
    </footer>
  );
}
