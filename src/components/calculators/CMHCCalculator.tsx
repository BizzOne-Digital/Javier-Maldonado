"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { calculateCMHC } from "@/config/calculators/cmhc";
import { useLabels } from "@/lib/labels";
import { formatCurrency } from "@/lib/utils";
import { CalculatorShell } from "./CalculatorShell";

const fieldClass =
  "w-full rounded-xl border border-champagne/30 bg-white/80 px-4 py-3 text-midnight focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20";

export function CMHCCalculator() {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");
  const fmt = (n: number) => formatCurrency(n, locale === "es" ? "es-CA" : "en-CA");

  const [purchasePrice, setPurchasePrice] = useState(750000);
  const [downPayment, setDownPayment] = useState(75000);
  const [amortizationYears, setAmortizationYears] = useState(25);

  const result = useMemo(
    () => calculateCMHC({ purchasePrice, downPayment, amortizationYears }),
    [purchasePrice, downPayment, amortizationYears]
  );

  const reset = () => {
    setPurchasePrice(750000);
    setDownPayment(75000);
    setAmortizationYears(25);
  };

  return (
    <CalculatorShell
      title={t("calculators.cmhc")}
      subtitle={
        locale === "es"
          ? "Estime la prima de seguro hipotecario CMHC."
          : "Estimate CMHC mortgage loan insurance premium."
      }
      onReset={reset}
      results={
        <dl className="space-y-4">
          {!result.eligible && result.reason && (
            <p className="text-copper text-sm font-medium">{result.reason}</p>
          )}
          <div className="flex justify-between border-b border-champagne/20 pb-3">
            <dt className="text-slate/70">Premium amount</dt>
            <dd className="font-display text-2xl text-midnight">{fmt(result.premiumAmount)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate/70">Premium rate</dt>
            <dd className="font-semibold">{(result.premiumRate * 100).toFixed(2)}%</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate/70">LTV</dt>
            <dd className="font-semibold">{result.ltv.toFixed(1)}%</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate/70">Min. down payment</dt>
            <dd className="font-semibold">{fmt(result.minimumDownPayment)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate/70">Mortgage amount</dt>
            <dd className="font-semibold">{fmt(result.mortgageAmount)}</dd>
          </div>
        </dl>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate mb-1.5">Purchase price</label>
          <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} className={fieldClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate mb-1.5">Down payment</label>
          <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className={fieldClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate mb-1.5">Amortization (years)</label>
          <input type="number" value={amortizationYears} onChange={(e) => setAmortizationYears(Number(e.target.value))} className={fieldClass} />
        </div>
      </div>
    </CalculatorShell>
  );
}
