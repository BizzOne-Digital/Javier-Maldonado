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

const homeValueSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  address: z.string().min(5),
  city: z.string().min(2),
  propertyType: z.string().min(1),
  bedrooms: z.number().min(0),
  timeline: z.string().min(1),
  reason: z.string().optional(),
});

type HomeValueFormData = z.infer<typeof homeValueSchema>;

interface HomeValueFormProps {
  className?: string;
}

export function HomeValueForm({ className }: HomeValueFormProps) {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HomeValueFormData>({
    resolver: zodResolver(homeValueSchema),
  });

  const onSubmit = async (data: HomeValueFormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: "home-value",
          message: `Home value request: ${data.address}, ${data.city}. Timeline: ${data.timeline}`,
          locale,
        }),
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
      <p className="text-sm text-slate/70 mb-6">
        {locale === "es"
          ? "Solicite un análisis personalizado de mercado — sin valoraciones automáticas."
          : "Request a personalized market analysis — no automated valuations."}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate mb-1.5">{t("forms.name")}</label>
            <input {...register("name")} className={fieldClass} />
            {errors.name && <p className="mt-1 text-sm text-copper">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate mb-1.5">{t("forms.phone")}</label>
            <input type="tel" {...register("phone")} className={fieldClass} />
            {errors.phone && <p className="mt-1 text-sm text-copper">{errors.phone.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate mb-1.5">{t("forms.email")}</label>
          <input type="email" {...register("email")} className={fieldClass} />
          {errors.email && <p className="mt-1 text-sm text-copper">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate mb-1.5">{t("forms.address")}</label>
          <input {...register("address")} className={fieldClass} />
          {errors.address && <p className="mt-1 text-sm text-copper">{errors.address.message}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate mb-1.5">{t("forms.city")}</label>
            <input {...register("city")} className={fieldClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate mb-1.5">{t("forms.propertyType")}</label>
            <select {...register("propertyType")} className={fieldClass}>
              <option value="detached">Detached</option>
              <option value="semi">Semi-detached</option>
              <option value="townhouse">Townhouse</option>
              <option value="condo">Condo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate mb-1.5">{t("forms.bedrooms")}</label>
            <input type="number" min={0} {...register("bedrooms", { valueAsNumber: true })} className={fieldClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate mb-1.5">{t("forms.timeline")}</label>
          <select {...register("timeline")} className={fieldClass}>
            <option value="">{locale === "es" ? "Seleccionar" : "Select"}</option>
            <option value="asap">{locale === "es" ? "Lo antes posible" : "As soon as possible"}</option>
            <option value="1-3">{locale === "es" ? "1–3 meses" : "1–3 months"}</option>
            <option value="3-6">{locale === "es" ? "3–6 meses" : "3–6 months"}</option>
            <option value="exploring">{locale === "es" ? "Solo explorando" : "Just exploring"}</option>
          </select>
          {errors.timeline && <p className="mt-1 text-sm text-copper">{errors.timeline.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate mb-1.5">{t("forms.reason")}</label>
          <textarea {...register("reason")} rows={3} className={cn(fieldClass, "resize-none")} />
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
