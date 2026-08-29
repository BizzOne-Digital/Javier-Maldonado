/**
 * CMHC Mortgage Loan Insurance Configuration
 * effectiveDate: 2026-01-01
 * Source: https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/mortgage-loan-insurance-homeownership-programs/purchase
 * Verify current CMHC rules before production launch.
 */
export const cmhcConfig = {
  effectiveDate: "2026-01-01",
  sourceUrl:
    "https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/mortgage-loan-insurance-homeownership-programs/purchase",
  maxInsuredPrice: 1_500_000,
  minDownPaymentRules: {
    first500k: 0.05,
    remainder: 0.1,
  },
  premiumTiers: [
    { maxLtv: 65, rate: 0.006 },
    { maxLtv: 75, rate: 0.017 },
    { maxLtv: 80, rate: 0.024 },
    { maxLtv: 85, rate: 0.028 },
    { maxLtv: 90, rate: 0.031 },
    { maxLtv: 95, rate: 0.04 },
  ],
  amortizationSurcharge: 0.002,
  standardAmortizationYears: 25,
};

export interface CMHCInput {
  purchasePrice: number;
  downPayment: number;
  amortizationYears: number;
}

export interface CMHCResult {
  eligible: boolean;
  reason?: string;
  minimumDownPayment: number;
  ltv: number;
  premiumRate: number;
  premiumAmount: number;
  mortgageAmount: number;
}

export function calculateMinimumDownPayment(purchasePrice: number): number {
  if (purchasePrice <= 0) return 0;
  if (purchasePrice >= cmhcConfig.maxInsuredPrice) {
    return purchasePrice * 0.2;
  }
  const first = Math.min(purchasePrice, 500_000) * cmhcConfig.minDownPaymentRules.first500k;
  const remainder = Math.max(0, purchasePrice - 500_000) * cmhcConfig.minDownPaymentRules.remainder;
  return first + remainder;
}

export function getPremiumRate(ltv: number, amortizationYears: number): number {
  let rate = cmhcConfig.premiumTiers[cmhcConfig.premiumTiers.length - 1].rate;
  for (const tier of cmhcConfig.premiumTiers) {
    if (ltv <= tier.maxLtv) {
      rate = tier.rate;
      break;
    }
  }
  if (amortizationYears > cmhcConfig.standardAmortizationYears) {
    rate += cmhcConfig.amortizationSurcharge;
  }
  return rate;
}

export function calculateCMHC(input: CMHCInput): CMHCResult {
  const { purchasePrice, downPayment, amortizationYears } = input;
  if (purchasePrice <= 0) {
    return { eligible: false, reason: "Invalid purchase price", minimumDownPayment: 0, ltv: 0, premiumRate: 0, premiumAmount: 0, mortgageAmount: 0 };
  }
  const minimumDownPayment = calculateMinimumDownPayment(purchasePrice);
  const mortgageAmount = purchasePrice - downPayment;
  const ltv = (mortgageAmount / purchasePrice) * 100;

  if (purchasePrice >= cmhcConfig.maxInsuredPrice && ltv > 80) {
    return { eligible: false, reason: "Insured purchase price must be below $1,500,000", minimumDownPayment, ltv, premiumRate: 0, premiumAmount: 0, mortgageAmount };
  }
  if (downPayment < minimumDownPayment) {
    return { eligible: false, reason: "Down payment below minimum required", minimumDownPayment, ltv, premiumRate: 0, premiumAmount: 0, mortgageAmount };
  }
  if (ltv <= 80) {
    return { eligible: true, minimumDownPayment, ltv, premiumRate: 0, premiumAmount: 0, mortgageAmount };
  }
  const premiumRate = getPremiumRate(ltv, amortizationYears);
  const premiumAmount = mortgageAmount * premiumRate;
  return { eligible: true, minimumDownPayment, ltv, premiumRate, premiumAmount, mortgageAmount };
}
