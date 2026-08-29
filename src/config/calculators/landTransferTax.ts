/**
 * Ontario & Toronto Land Transfer Tax Configuration
 * effectiveDate: 2026-04-01
 * Sources:
 * - Ontario: https://www.ontario.ca/document/land-transfer-tax/calculating-land-transfer-tax
 * - Ontario FTB refund: https://www.ontario.ca/document/land-transfer-tax/land-transfer-tax-refunds-first-time-homebuyers
 * - Toronto MLTT: https://www.toronto.ca/services-payments/property-taxes-utilities/municipal-land-transfer-tax-mltt/municipal-land-transfer-tax-mltt-rates-and-fees/
 * - Toronto FTB rebate: https://www.toronto.ca/services-payments/property-taxes-utilities/municipal-land-transfer-tax-mltt/municipal-land-transfer-tax-mltt-rebate-opportunities/
 */
export const lttConfig = {
  effectiveDate: "2026-04-01",
  ontarioBrackets: [
    { upTo: 55_000, rate: 0.005 },
    { upTo: 250_000, rate: 0.01 },
    { upTo: 400_000, rate: 0.015 },
    { upTo: 2_000_000, rate: 0.02 },
    { upTo: Infinity, rate: 0.025 },
  ],
  torontoBracketsStandard: [
    { upTo: 55_000, rate: 0.005 },
    { upTo: 250_000, rate: 0.01 },
    { upTo: 400_000, rate: 0.015 },
    { upTo: 2_000_000, rate: 0.02 },
    { upTo: Infinity, rate: 0.025 },
  ],
  torontoBracketsHighValue: [
    { upTo: 55_000, rate: 0.005 },
    { upTo: 250_000, rate: 0.01 },
    { upTo: 400_000, rate: 0.015 },
    { upTo: 2_000_000, rate: 0.02 },
    { upTo: 3_000_000, rate: 0.035 },
    { upTo: 4_000_000, rate: 0.045 },
    { upTo: 5_000_000, rate: 0.055 },
    { upTo: 10_000_000, rate: 0.065 },
    { upTo: 20_000_000, rate: 0.075 },
    { upTo: Infinity, rate: 0.085 },
  ],
  torontoHighValueThreshold: 3_000_000,
  torontoHighValueEffectiveDate: "2026-04-01",
  ontarioFtbMaxRefund: 4_000,
  torontoFtbMaxRebate: 4_475,
};

function calcBracketTax(price: number, brackets: { upTo: number; rate: number }[]): number {
  let tax = 0;
  let prev = 0;
  for (const bracket of brackets) {
    const taxable = Math.min(price, bracket.upTo) - prev;
    if (taxable > 0) tax += taxable * bracket.rate;
    prev = bracket.upTo;
    if (price <= bracket.upTo) break;
  }
  return tax;
}

export interface LTTInput {
  purchasePrice: number;
  isToronto: boolean;
  isFirstTimeBuyer: boolean;
  purchaseDate?: string;
  propertyType?: "residential" | "other";
}

export interface LTTResult {
  provincialTax: number;
  provincialRefund: number;
  provincialNet: number;
  municipalTax: number;
  municipalRebate: number;
  municipalNet: number;
  totalTax: number;
  totalNet: number;
}

export function calculateLandTransferTax(input: LTTInput): LTTResult {
  const { purchasePrice, isToronto, isFirstTimeBuyer } = input;
  const provincialTax = calcBracketTax(purchasePrice, lttConfig.ontarioBrackets);
  const provincialRefund = isFirstTimeBuyer ? Math.min(provincialTax, lttConfig.ontarioFtbMaxRefund) : 0;
  const provincialNet = provincialTax - provincialRefund;

  let municipalTax = 0;
  let municipalRebate = 0;
  if (isToronto) {
    const useHighValue = purchasePrice > lttConfig.torontoHighValueThreshold;
    const brackets = useHighValue ? lttConfig.torontoBracketsHighValue : lttConfig.torontoBracketsStandard;
    municipalTax = calcBracketTax(purchasePrice, brackets);
    municipalRebate = isFirstTimeBuyer ? Math.min(municipalTax, lttConfig.torontoFtbMaxRebate) : 0;
  }
  const municipalNet = municipalTax - municipalRebate;
  return {
    provincialTax,
    provincialRefund,
    provincialNet,
    municipalTax,
    municipalRebate,
    municipalNet,
    totalTax: provincialTax + municipalTax,
    totalNet: provincialNet + municipalNet,
  };
}
