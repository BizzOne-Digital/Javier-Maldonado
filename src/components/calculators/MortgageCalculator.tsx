"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import {
  calculateMortgage,
  type PaymentFrequency,
} from "@/config/calculators/mortgage";
import { useLabels } from "@/lib/labels";
import { formatCurrency } from "@/lib/utils";
import { CalculatorShell } from "./CalculatorShell";

const fieldClass =
  "w-full rounded-xl border border-champagne/30 bg-white/80 px-4 py-3 text-midnight focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20";

export function MortgageCalculator() {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");
  const fmt = (n: number) => formatCurrency(n, locale === "es" ? "es-CA" : "en-CA");

  const [purchasePrice, setPurchasePrice] = useState(750000);
  const [downPayment, setDownPayment] = useState(150000);
  const [annualRate, setAnnualRate] = useState(5.24);
  const [amortizationYears, setAmortizationYears] = useState(25);
  const [frequency, setFrequency] = useState<PaymentFrequency>("monthly");
  const [propertyTaxes, setPropertyTaxes] = useState(4800);
  const [condoFees, setCondoFees] = useState(0);
  const [heating, setHeating] = useState(1200);

  const result = useMemo(
    () =>
      calculateMortgage({
        purchasePrice,
        downPayment,
        annualRate,
        amortizationYears,
        frequency,
        propertyTaxes,
        condoFees,
        heating,
      }),
    [purchasePrice, downPayment, annualRate, amortizationYears, frequency, propertyTaxes, condoFees, heating]
  );

  const reset = () => {
    setPurchasePrice(750000);
    setDownPayment(150000);
    setAnnualRate(5.24);
    setAmortizationYears(25);
    setFrequency("monthly");
    setPropertyTaxes(4800);
    setCondoFees(0);
    setHeating(1200);
  };

  return (
    <CalculatorShell
      title={t("calculators.mortgage")}
      subtitle={
        locale === "es"
          ? "Estime su pago hipotecario mensual o bisemanal."
          : "Estimate your monthly or bi-weekly mortgage payment."
      }
      onReset={reset}
      results={
        <dl className="space-y-4">
          <div className="flex justify-between border-b border-champagne/20 pb-3">
            <dt className="text-slate/70">Payment</dt>
            <dd className="font-display text-2xl text-midnight">{fmt(result.payment)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate/70">Mortgage amount</dt>
            <dd className="font-semibold">{fmt(result.mortgageAmount)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate/70">Total interest</dt>
            <dd className="font-semibold">{fmt(result.totalInterest)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate/70">Total cost</dt>
            <dd className="font-semibold">{fmt(result.totalCost)}</dd>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate mb-1.5">Rate (%)</label>
            <input type="number" step="0.01" value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value))} className={fieldClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate mb-1.5">Amortization (yrs)</label>
            <input type="number" value={amortizationYears} onChange={(e) => setAmortizationYears(Number(e.target.value))} className={fieldClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate mb-1.5">Payment frequency</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value as PaymentFrequency)} className={fieldClass}>
            <option value="monthly">Monthly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="accelerated_biweekly">Accelerated bi-weekly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate mb-1.5">Property tax/yr</label>
            <input type="number" value={propertyTaxes} onChange={(e) => setPropertyTaxes(Number(e.target.value))} className={fieldClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate mb-1.5">Condo fees/yr</label>
            <input type="number" value={condoFees} onChange={(e) => setCondoFees(Number(e.target.value))} className={fieldClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate mb-1.5">Heating/yr</label>
            <input type="number" value={heating} onChange={(e) => setHeating(Number(e.target.value))} className={fieldClass} />
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
