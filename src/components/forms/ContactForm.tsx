"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale } from "next-intl";
import { useLabels } from "@/lib/labels";
import { Button } from "@/components/ui/Button";
import { GradientCard } from "@/components/ui/GradientCard";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  message: z.string().min(10, "Please include a brief message"),
  subject: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className }: ContactFormProps) {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-champagne/30 bg-white/80 px-4 py-3 text-midnight focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20";

  return (
    <GradientCard className={className} tilt={false}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate mb-1.5">
              {t("forms.name")}
            </label>
            <input {...register("name")} className={fieldClass} />
            {errors.name && <p className="mt-1 text-sm text-copper">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate mb-1.5">
              {t("forms.phone")}
            </label>
            <input type="tel" {...register("phone")} className={fieldClass} />
            {errors.phone && <p className="mt-1 text-sm text-copper">{errors.phone.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate mb-1.5">
            {t("forms.email")}
          </label>
          <input type="email" {...register("email")} className={fieldClass} />
          {errors.email && <p className="mt-1 text-sm text-copper">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate mb-1.5">
            {t("forms.message")}
          </label>
          <textarea {...register("message")} rows={5} className={cn(fieldClass, "resize-none")} />
          {errors.message && <p className="mt-1 text-sm text-copper">{errors.message.message}</p>}
        </div>

        {status === "success" && <p className="text-sm text-lake">{t("forms.success")}</p>}
        {status === "error" && <p className="text-sm text-copper">{t("forms.error")}</p>}

        <Button type="submit" disabled={status === "loading"} magnetic>
          {status === "loading" ? t("forms.sending") : t("forms.submit")}
        </Button>
      </form>
    </GradientCard>
  );
}
