"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { calculateLandTransferTax } from "@/config/calculators/landTransferTax";
import { useLabels } from "@/lib/labels";
import { formatCurrency } from "@/lib/utils";
import { CalculatorShell } from "./CalculatorShell";

const fieldClass =
  "w-full rounded-xl border border-champagne/30 bg-white/80 px-4 py-3 text-midnight focus:border-lake focus:outline-none focus:ring-2 focus:ring-lake/20";

export function LandTransferCalculator() {
  const locale = useLocale();
  const t = useLabels(locale as "en" | "es");
  const fmt = (n: number) => formatCurrency(n, locale === "es" ? "es-CA" : "en-CA");

  const [purchasePrice, setPurchasePrice] = useState(750000);
  const [isToronto, setIsToronto] = useState(false);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(true);

  const result = useMemo(
    () => calculateLandTransferTax({ purchasePrice, isToronto, isFirstTimeBuyer }),
    [purchasePrice, isToronto, isFirstTimeBuyer]
  );

  const reset = () => {
    setPurchasePrice(750000);
    setIsToronto(false);
    setIsFirstTimeBuyer(true);
  };

  return (
    <CalculatorShell
      title={t("calculators.landTransfer")}
      subtitle={
        locale === "es"
          ? "Impuesto de transferencia de Ontario y Toronto."
          : "Ontario and Toronto land transfer tax estimate."
      }
      onReset={reset}
      results={
        <dl className="space-y-4">
          <div className="flex justify-between border-b border-champagne/20 pb-3">
            <dt className="text-slate/70">Total (net)</dt>
            <dd className="font-display text-2xl text-midnight">{fmt(result.totalNet)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate/70">Provincial tax</dt>
            <dd className="font-semibold">{fmt(result.provincialTax)}</dd>
          </div>
          {result.provincialRefund > 0 && (
            <div className="flex justify-between text-lake">
              <dt>Provincial FTB refund</dt>
              <dd className="font-semibold">−{fmt(result.provincialRefund)}</dd>
            </div>
          )}
          {isToronto && (
            <>
              <div className="flex justify-between">
                <dt className="text-slate/70">Municipal tax (Toronto)</dt>
                <dd className="font-semibold">{fmt(result.municipalTax)}</dd>
              </div>
              {result.municipalRebate > 0 && (
                <div className="flex justify-between text-lake">
                  <dt>Toronto FTB rebate</dt>
                  <dd className="font-semibold">−{fmt(result.municipalRebate)}</dd>
                </div>
              )}
            </>
          )}
          <div className="flex justify-between pt-2 border-t border-champagne/20">
            <dt className="text-slate/70">Gross total</dt>
            <dd className="font-semibold">{fmt(result.totalTax)}</dd>
          </div>
        </dl>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate mb-1.5">Purchase price</label>
          <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} className={fieldClass} />
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-slate">
            <input type="checkbox" checked={isToronto} onChange={(e) => setIsToronto(e.target.checked)} className="rounded border-champagne/40" />
            Toronto property
          </label>
          <label className="flex items-center gap-2 text-sm text-slate">
            <input type="checkbox" checked={isFirstTimeBuyer} onChange={(e) => setIsFirstTimeBuyer(e.target.checked)} className="rounded border-champagne/40" />
            First-time buyer
          </label>
        </div>
      </div>
    </CalculatorShell>
  );
}
