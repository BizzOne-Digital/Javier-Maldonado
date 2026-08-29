"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale } from "next-intl";
import { useLabels } from "@/lib/labels";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Phone is required"),
  message: z.string().optional(),
  source: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  source?: string;
  className?: string;
  onSuccess?: () => void;
}

export function LeadForm({ source = "website", className, onSuccess }: LeadFormProps) {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: { source },
  });

  const onSubmit = async (data: LeadFormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-champagne/30 bg-ivory/50 px-4 py-3 text-midnight placeholder:text-slate/50 focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20 transition-colors";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
      <div>
        <label className="block text-sm font-medium text-slate mb-1.5">
          {t("forms.name")}
        </label>
        <input {...register("name")} className={fieldClass} />
        {errors.name && (
          <p className="mt-1 text-sm text-copper">{errors.name.message}</p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate mb-1.5">
            {t("forms.email")}
          </label>
          <input type="email" {...register("email")} className={fieldClass} />
          {errors.email && (
            <p className="mt-1 text-sm text-copper">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate mb-1.5">
            {t("forms.phone")}
          </label>
          <input type="tel" {...register("phone")} className={fieldClass} />
          {errors.phone && (
            <p className="mt-1 text-sm text-copper">{errors.phone.message}</p>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate mb-1.5">
          {t("forms.message")}
        </label>
        <textarea
          {...register("message")}
          rows={4}
          className={cn(fieldClass, "resize-none")}
        />
      </div>
      <input type="hidden" {...register("source")} />

      {status === "success" && (
        <p className="text-sm text-lake font-medium">{t("forms.success")}</p>
      )}
      {status === "error" && (
        <p className="text-sm text-copper">{t("forms.error")}</p>
      )}

      <Button type="submit" disabled={status === "loading"} magnetic className="w-full sm:w-auto">
        {status === "loading" ? t("forms.sending") : t("forms.submit")}
      </Button>
    </form>
  );
}
