"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useLocale } from "next-intl";
import { useLabels } from "@/lib/labels";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Testimonial {
  _id: string;
  name: string;
  location?: string;
  quote: { en: string; es: string };
  rating?: number;
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

const fallbackTestimonials: Testimonial[] = [
  {
    _id: "1",
    name: "Client",
    location: "Etobicoke",
    quote: {
      en: "Javier made our first home purchase feel calm and informed at every step.",
      es: "Javier hizo que nuestra primera compra se sintiera tranquila e informada en cada paso.",
    },
    rating: 5,
  },
];

export function TestimonialsSection({
  testimonials = fallbackTestimonials,
}: TestimonialsSectionProps) {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 md:py-32 bg-midnight relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,121,69,0.1),transparent_70%)]" />
      <div className="relative mx-auto max-w-4xl px-4 md:px-6 text-center">
        <SectionHeading
          eyebrow="Reviews"
          title={t("home.testimonials")}
          light
          align="center"
          singleLine
          className="mb-16"
        />

        <div className="relative min-h-[280px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current._id}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -20 }}
              className="max-w-2xl"
            >
              <Quote className="w-10 h-10 text-copper/40 mx-auto mb-6" />
              <p className="font-display text-2xl md:text-3xl text-ivory leading-relaxed mb-8">
                &ldquo;{locale === "es" ? current.quote.es : current.quote.en}&rdquo;
              </p>
              <footer className="text-champagne/80">
                <cite className="not-italic font-semibold text-champagne">{current.name}</cite>
                {current.location && (
                  <span className="text-champagne/50"> · {current.location}</span>
                )}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={prev}
              className="p-3 rounded-full border border-champagne/20 text-champagne hover:border-copper hover:text-copper transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === index ? "bg-copper" : "bg-champagne/30"
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="p-3 rounded-full border border-champagne/20 text-champagne hover:border-copper hover:text-copper transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
