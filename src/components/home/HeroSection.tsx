"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Compass, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const sideLinks = [
  { href: "/buy", label: "BUY" },
  { href: "/sell", label: "SELL" },
  { href: "/rent", label: "RENT" },
  { href: "/invest", label: "INVEST" },
] as const;

const propertyTypes = [
  "Detached",
  "Semi-Detached",
  "Condo",
  "Townhouse",
  "Multi-Family",
];

const priceRanges = [
  "Under $500,000",
  "$500,000 – $750,000",
  "$750,000 – $1,000,000",
  "$1,000,000 – $1,500,000",
  "$1,500,000+",
];

export function HeroSection() {
  const locale = useLocale();
  const t = useTranslations("hero");
  const ts = useTranslations("search");
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reducedMotion ? 0 : 60]
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const city = String(form.get("location") || "");
    const type = String(form.get("propertyType") || "");
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    router.push(`/listings${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#0A192F] w-full max-w-full"
    >
      {/* Background image — ss2 */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 min-h-full">
        <Image
          src="/hero-bg.png"
          alt="Luxury Toronto home at dusk with CN Tower skyline"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      {/* Subtle topographic pattern on left */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M0 30 Q15 20 30 30 T60 30'/%3E%3Cpath d='M0 15 Q15 5 30 15 T60 15'/%3E%3Cpath d='M0 45 Q15 35 30 45 T60 45'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Left content overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0A192F]/90 via-[#0A192F]/50 to-transparent lg:via-[#0A192F]/30 lg:to-transparent" />

      {/* Vertical floating menu — right edge */}
      <motion.nav
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9 }}
        className="absolute right-0 top-1/3 z-20 hidden -translate-y-1/2 lg:flex"
        aria-label="Quick services"
      >
        <div className="flex flex-col items-center gap-5 border-l border-copper/30 bg-[#0A192F]/85 px-3 py-8 backdrop-blur-md">
          <Compass className="h-5 w-5 text-copper" />
          {sideLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 transition-colors [writing-mode:vertical-rl] hover:text-copper"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </motion.nav>

      {/* Content + search in normal document flow */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-6.5rem)] w-full min-w-0 max-w-7xl flex-col px-4 md:px-6">
        {/* Hero copy */}
        <div className="flex min-w-0 flex-1 flex-col justify-center py-10 md:py-14 lg:py-16">
          <div className="min-w-0 max-w-xl lg:max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-4 font-label text-[11px] uppercase tracking-[0.25em] text-copper md:text-xs"
            >
              {t("eyebrow")}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-display text-3xl leading-[1.08] text-white break-words sm:text-4xl md:text-[2.75rem] lg:text-5xl xl:text-6xl 2xl:whitespace-nowrap"
            >
              {t("headline")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-5 max-w-lg text-sm leading-relaxed text-white/75 md:text-base"
            >
              {t("subheadline")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                href="/buy"
                className="inline-flex items-center rounded-md bg-copper px-6 py-3 font-label text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-copper/30 transition-all hover:bg-[#b56a38]"
              >
                {t("ctaPrimary")}
              </Link>
              <Link
                href="/listings"
                className="inline-flex items-center rounded-md border border-white/40 bg-transparent px-6 py-3 font-label text-xs font-semibold uppercase tracking-wider text-white transition-all hover:border-white hover:bg-white/10"
              >
                {t("ctaTertiary")}
              </Link>
            </motion.div>

            {/* Location pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="mt-8 flex flex-wrap gap-2 md:mt-10"
            >
              {siteConfig.serviceAreas.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() =>
                    router.push(
                      `/listings?city=${encodeURIComponent(city)}`
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-full border border-copper/40 bg-[#0A192F]/60 px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm transition-all hover:border-copper hover:bg-copper/20"
                >
                  <MapPin className="h-3 w-3 text-copper" />
                  {city}
                </button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Search widget — in flow, no overlap with next section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="w-full min-w-0 max-w-full pb-8 md:pb-10"
        >
          <form
            onSubmit={handleSearch}
            className="mx-auto w-full min-w-0 max-w-4xl rounded-2xl border border-white/20 bg-white/95 p-4 shadow-2xl shadow-midnight/20 backdrop-blur-md sm:p-5 md:p-6"
          >
            <h2 className="mb-4 font-display text-lg text-midnight md:text-xl">
              {ts("title")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label
                  htmlFor="hero-location"
                  className="mb-1 block font-label text-[10px] uppercase tracking-wider text-midnight/50"
                >
                  {ts("location")}
                </label>
                <select
                  id="hero-location"
                  name="location"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-midnight focus:border-copper focus:outline-none focus:ring-1 focus:ring-copper"
                >
                  <option value="">
                    {locale === "es" ? "Seleccionar" : "Select"}
                  </option>
                  {siteConfig.serviceAreas.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="hero-type"
                  className="mb-1 block font-label text-[10px] uppercase tracking-wider text-midnight/50"
                >
                  {ts("propertyType")}
                </label>
                <select
                  id="hero-type"
                  name="propertyType"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-midnight focus:border-copper focus:outline-none focus:ring-1 focus:ring-copper"
                >
                  <option value="">
                    {locale === "es" ? "Seleccionar" : "Select"}
                  </option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="hero-price"
                  className="mb-1 block font-label text-[10px] uppercase tracking-wider text-midnight/50"
                >
                  {ts("priceRange")}
                </label>
                <select
                  id="hero-price"
                  name="priceRange"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-midnight focus:border-copper focus:outline-none focus:ring-1 focus:ring-copper"
                >
                  <option value="">
                    {locale === "es" ? "Seleccionar" : "Select"}
                  </option>
                  {priceRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-lg bg-copper px-6 py-2.5 font-label text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-copper/25 transition-all hover:bg-[#b56a38]"
                  )}
                >
                  {ts("search")}
                  <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
