"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { useLabels } from "@/lib/labels";
import { Button } from "@/components/ui/Button";
import { GradientCard } from "@/components/ui/GradientCard";
import { cn } from "@/lib/utils";

const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  consultationType: z.enum(["buying", "selling", "investing", "general"]),
  preferredDate: z.string().min(1),
  preferredTime: z.string().min(1),
  message: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const STEPS = ["contact", "details", "confirm"] as const;

interface BookingFormProps {
  className?: string;
}

export function BookingForm({ className }: BookingFormProps) {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      consultationType: "general",
    },
  });

  const { register, handleSubmit, trigger, formState: { errors } } = form;

  const nextStep = async () => {
    const fields: (keyof BookingFormData)[][] = [
      ["name", "email", "phone"],
      ["consultationType", "preferredDate", "preferredTime"],
      [],
    ];
    const valid = await trigger(fields[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = async (data: BookingFormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-champagne/30 bg-white/80 px-4 py-3 text-midnight focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20";

  const consultationOptions = [
    { value: "buying", label: t("services.buying") },
    { value: "selling", label: t("services.selling") },
    { value: "investing", label: t("services.investing") },
    { value: "general", label: t("nav.contact") },
  ] as const;

  return (
    <GradientCard className={className} tilt={false}>
      <div className="flex gap-2 mb-8">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i <= step ? "bg-gradient-to-r from-copper to-lake" : "bg-champagne/30"
            )}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate mb-1.5">{t("forms.name")}</label>
                <input {...register("name")} className={fieldClass} />
                {errors.name && <p className="mt-1 text-sm text-copper">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate mb-1.5">{t("forms.email")}</label>
                <input type="email" {...register("email")} className={fieldClass} />
                {errors.email && <p className="mt-1 text-sm text-copper">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate mb-1.5">{t("forms.phone")}</label>
                <input type="tel" {...register("phone")} className={fieldClass} />
                {errors.phone && <p className="mt-1 text-sm text-copper">{errors.phone.message}</p>}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate mb-1.5">
                  {t("forms.consultationType")}
                </label>
                <select {...register("consultationType")} className={fieldClass}>
                  {consultationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate mb-1.5">
                    {t("forms.preferredDate")}
                  </label>
                  <input type="date" {...register("preferredDate")} className={fieldClass} />
                  {errors.preferredDate && (
                    <p className="mt-1 text-sm text-copper">{errors.preferredDate.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate mb-1.5">
                    {t("forms.preferredTime")}
                  </label>
                  <input type="time" {...register("preferredTime")} className={fieldClass} />
                  {errors.preferredTime && (
                    <p className="mt-1 text-sm text-copper">{errors.preferredTime.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate mb-1.5">{t("forms.message")}</label>
                <textarea {...register("message")} rows={3} className={cn(fieldClass, "resize-none")} />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 text-slate"
            >
              <p className="text-lg font-display text-midnight">
                {locale === "es" ? "Revise su solicitud" : "Review your request"}
              </p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-champagne/20 py-2">
                  <dt>{t("forms.name")}</dt>
                  <dd className="font-medium">{form.watch("name")}</dd>
                </div>
                <div className="flex justify-between border-b border-champagne/20 py-2">
                  <dt>{t("forms.email")}</dt>
                  <dd className="font-medium">{form.watch("email")}</dd>
                </div>
                <div className="flex justify-between border-b border-champagne/20 py-2">
                  <dt>{t("forms.preferredDate")}</dt>
                  <dd className="font-medium">{form.watch("preferredDate")}</dd>
                </div>
              </dl>
              {status === "success" && <p className="text-lake">{t("forms.success")}</p>}
              {status === "error" && <p className="text-copper">{t("forms.error")}</p>}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
              {t("forms.back")}
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={nextStep} magnetic>
              {t("forms.next")}
            </Button>
          ) : (
            <Button type="submit" disabled={status === "loading" || status === "success"} magnetic>
              {status === "loading" ? t("forms.sending") : t("forms.submit")}
            </Button>
          )}
        </div>
      </form>
    </GradientCard>
  );
}
