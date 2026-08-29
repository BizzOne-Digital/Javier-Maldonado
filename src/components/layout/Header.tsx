"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Menu, Phone, X } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/ui/SocialIcons";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/buy", key: "buy" },
  { href: "/sell", key: "sell" },
  { href: "/rent", key: "rent" },
  { href: "/invest", key: "invest" },
  { href: "/listings", key: "listings" },
  { href: "/calculators", key: "calculators" },
  { href: "/about", key: "about" },
] as const;

export function Header() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const switchLocale = (next: "en" | "es") => {
    router.replace(pathname, { locale: next });
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-50 w-full max-w-full overflow-x-clip">
        {/* Top bar */}
        <div className="bg-[#0A192F] text-white/90">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs md:px-6">
            <div className="flex items-center gap-2 font-label uppercase tracking-widest">
              <span className="hidden sm:inline text-white/70">
                GTA Real Estate
              </span>
              <span className="hidden sm:inline text-white/30">•</span>
              <div className="flex items-center gap-1">
                {(["en", "es"] as const).map((loc, i) => (
                  <span key={loc} className="flex items-center gap-1">
                    {i > 0 && <span className="text-white/30">|</span>}
                    <button
                      type="button"
                      onClick={() => switchLocale(loc)}
                      className={cn(
                        "uppercase transition-colors hover:text-copper",
                        locale === loc
                          ? "text-copper font-semibold"
                          : "text-white/70"
                      )}
                    >
                      {loc}
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={siteConfig.phoneHref}
                className="hidden items-center gap-1.5 font-medium text-white/90 hover:text-copper transition-colors md:flex"
              >
                <Phone className="h-3.5 w-3.5 text-copper" />
                {siteConfig.phone}
              </a>
              <div className="flex items-center gap-2">
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-copper transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-copper transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-copper transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div
          className={cn(
            "border-b border-gray-100 bg-white transition-shadow duration-300",
            scrolled && "shadow-md shadow-midnight/5"
          )}
        >
          <div className="mx-auto flex w-full min-w-0 max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 md:px-6">
            <Link href="/" className="relative z-10 flex min-w-0 shrink items-center">
              <Image
                src="/logo.png"
                alt={`${siteConfig.name} Real Estate`}
                width={240}
                height={72}
                priority
                className="h-10 w-auto max-w-[52vw] object-contain sm:h-14 sm:max-w-[200px] md:h-16 lg:h-[4.5rem] lg:max-w-none"
              />
            </Link>

            <nav
              className="hidden items-center gap-5 xl:gap-7 lg:flex"
              aria-label="Main"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-label text-xs uppercase tracking-wider transition-colors",
                    isActive(link.href)
                      ? "font-semibold text-copper"
                      : "text-midnight/70 hover:text-copper"
                  )}
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>

            <Link
              href="/booking"
              className="hidden shrink-0 rounded-md bg-copper px-5 py-2.5 font-label text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-copper/25 transition-all hover:bg-[#b56a38] hover:shadow-lg lg:inline-flex"
            >
              {t("booking")}
            </Link>

            <button
              type="button"
              className="relative z-10 p-2 text-midnight lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-midnight/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white p-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              aria-label="Mobile"
            >
              <div className="mb-8 flex items-center justify-between">
                <Image
                  src="/logo.png"
                  alt={`${siteConfig.name} Real Estate`}
                  width={200}
                  height={60}
                  className="h-12 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-midnight"
                  aria-label="Close"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-lg px-3 py-3 font-label text-sm uppercase tracking-wider transition-colors",
                      isActive(link.href)
                        ? "bg-copper/10 font-semibold text-copper"
                        : "text-midnight/80 hover:bg-gray-50"
                    )}
                  >
                    {t(link.key)}
                  </Link>
                ))}
              </div>

              <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
                <a
                  href={siteConfig.phoneHref}
                  className="flex items-center gap-3 font-semibold text-midnight"
                >
                  <Phone className="h-5 w-5 text-copper" />
                  {siteConfig.phone}
                </a>
                <Link
                  href="/booking"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full rounded-md bg-copper py-3 text-center font-label text-xs font-semibold uppercase tracking-wider text-white"
                >
                  {t("booking")}
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
