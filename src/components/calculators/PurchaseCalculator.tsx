"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { calculatePurchase } from "@/config/calculators/mortgage";
import { useLabels } from "@/lib/labels";
import { formatCurrency } from "@/lib/utils";
import { CalculatorShell } from "./CalculatorShell";

const fieldClass =
  "w-full rounded-xl border border-champagne/30 bg-white/80 px-4 py-3 text-midnight focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20";

export function PurchaseCalculator() {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");
  const fmt = (n: number) => formatCurrency(n, locale === "es" ? "es-CA" : "en-CA");

  const [purchasePrice, setPurchasePrice] = useState(750000);
  const [downPayment, setDownPayment] = useState(150000);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(true);
  const [isToronto, setIsToronto] = useState(false);
  const [legalCosts, setLegalCosts] = useState(2000);
  const [inspectionCost, setInspectionCost] = useState(600);
  const [movingCost, setMovingCost] = useState(1500);
  const [propertyTaxAdjustment, setPropertyTaxAdjustment] = useState(800);
  const [renovationBudget, setRenovationBudget] = useState(0);
  const [annualRate, setAnnualRate] = useState(5.24);
  const [amortizationYears, setAmortizationYears] = useState(25);

  const result = useMemo(
    () =>
      calculatePurchase({
        purchasePrice,
        downPayment,
        isFirstTimeBuyer,
        isToronto,
        legalCosts,
        inspectionCost,
        movingCost,
        propertyTaxAdjustment,
        renovationBudget,
        annualRate,
        amortizationYears,
      }),
    [
      purchasePrice, downPayment, isFirstTimeBuyer, isToronto,
      legalCosts, inspectionCost, movingCost, propertyTaxAdjustment,
      renovationBudget, annualRate, amortizationYears,
    ]
  );

  const reset = () => {
    setPurchasePrice(750000);
    setDownPayment(150000);
    setIsFirstTimeBuyer(true);
    setIsToronto(false);
    setLegalCosts(2000);
    setInspectionCost(600);
    setMovingCost(1500);
    setPropertyTaxAdjustment(800);
    setRenovationBudget(0);
    setAnnualRate(5.24);
    setAmortizationYears(25);
  };

  return (
    <CalculatorShell
      title={t("calculators.purchase")}
      subtitle={
        locale === "es"
          ? "Calcule el efectivo necesario para cerrar su compra."
          : "Calculate total cash required to close your purchase."
      }
      onReset={reset}
      results={
        <dl className="space-y-4">
          <div className="flex justify-between border-b border-champagne/20 pb-3">
            <dt className="text-slate/70">Cash required</dt>
            <dd className="font-display text-2xl text-midnight">{fmt(result.cashRequired)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate/70">Closing costs</dt>
            <dd className="font-semibold">{fmt(result.closingCosts)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate/70">CMHC premium</dt>
            <dd className="font-semibold">{fmt(result.cmhcPremium)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate/70">Land transfer tax</dt>
            <dd className="font-semibold">{fmt(result.landTransferTax)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate/70">Monthly payment</dt>
            <dd className="font-semibold">{fmt(result.monthlyPayment)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate/70">Min. down payment</dt>
            <dd className="font-semibold">{fmt(result.minimumDownPayment)}</dd>
          </div>
        </dl>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate mb-1.5">Purchase price</label>
            <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} className={fieldClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate mb-1.5">Down payment</label>
            <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className={fieldClass} />
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-slate">
            <input type="checkbox" checked={isFirstTimeBuyer} onChange={(e) => setIsFirstTimeBuyer(e.target.checked)} className="rounded border-champagne/40" />
            First-time buyer
          </label>
          <label className="flex items-center gap-2 text-sm text-slate">
            <input type="checkbox" checked={isToronto} onChange={(e) => setIsToronto(e.target.checked)} className="rounded border-champagne/40" />
            Toronto property
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate mb-1.5">Legal costs</label>
            <input type="number" value={legalCosts} onChange={(e) => setLegalCosts(Number(e.target.value))} className={fieldClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate mb-1.5">Inspection</label>
            <input type="number" value={inspectionCost} onChange={(e) => setInspectionCost(Number(e.target.value))} className={fieldClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate mb-1.5">Moving</label>
            <input type="number" value={movingCost} onChange={(e) => setMovingCost(Number(e.target.value))} className={fieldClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate mb-1.5">Tax adjustment</label>
            <input type="number" value={propertyTaxAdjustment} onChange={(e) => setPropertyTaxAdjustment(Number(e.target.value))} className={fieldClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate mb-1.5">Renovation budget</label>
          <input type="number" value={renovationBudget} onChange={(e) => setRenovationBudget(Number(e.target.value))} className={fieldClass} />
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
      </div>
    </CalculatorShell>
  );
}
