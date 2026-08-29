export type PaymentFrequency = "monthly" | "biweekly" | "weekly" | "accelerated_biweekly";

export interface MortgageInput {
  purchasePrice: number;
  downPayment: number;
  annualRate: number;
  amortizationYears: number;
  frequency: PaymentFrequency;
  propertyTaxes?: number;
  condoFees?: number;
  heating?: number;
}

export interface MortgageResult {
  mortgageAmount: number;
  payment: number;
  totalPayments: number;
  totalInterest: number;
  totalCost: number;
  frequencyLabel: string;
  paymentsPerYear: number;
}

function getPaymentsPerYear(frequency: PaymentFrequency): number {
  switch (frequency) {
    case "monthly": return 12;
    case "biweekly": return 26;
    case "accelerated_biweekly": return 26;
    case "weekly": return 52;
  }
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const { purchasePrice, downPayment, annualRate, amortizationYears, frequency, propertyTaxes = 0, condoFees = 0, heating = 0 } = input;
  const mortgageAmount = Math.max(0, purchasePrice - downPayment);
  const paymentsPerYear = getPaymentsPerYear(frequency);
  const periodicRate = annualRate / 100 / paymentsPerYear;
  const totalPayments = amortizationYears * paymentsPerYear;

  let payment: number;
  if (periodicRate === 0) {
    payment = mortgageAmount / totalPayments;
  } else {
    payment = (mortgageAmount * periodicRate * Math.pow(1 + periodicRate, totalPayments)) / (Math.pow(1 + periodicRate, totalPayments) - 1);
  }

  if (frequency === "accelerated_biweekly") {
    payment = (mortgageAmount * (annualRate / 100 / 12) * Math.pow(1 + annualRate / 100 / 12, amortizationYears * 12)) /
      (Math.pow(1 + annualRate / 100 / 12, amortizationYears * 12) - 1) / 2;
  }

  const extras = (propertyTaxes + condoFees + heating) / (frequency === "monthly" ? 12 : frequency === "weekly" ? 52 : 26);
  payment += extras;

  const totalCost = payment * totalPayments;
  const totalInterest = totalCost - mortgageAmount - extras * totalPayments;

  return {
    mortgageAmount,
    payment,
    totalPayments,
    totalInterest: Math.max(0, totalInterest),
    totalCost,
    frequencyLabel: frequency,
    paymentsPerYear,
  };
}

export interface PurchaseInput {
  purchasePrice: number;
  downPayment: number;
  isFirstTimeBuyer: boolean;
  isToronto: boolean;
  legalCosts: number;
  inspectionCost: number;
  movingCost: number;
  propertyTaxAdjustment: number;
  renovationBudget: number;
  annualRate: number;
  amortizationYears: number;
}

import { calculateCMHC } from "./cmhc";
import { calculateLandTransferTax } from "./landTransferTax";

export function calculatePurchase(input: PurchaseInput) {
  const { purchasePrice, downPayment, isFirstTimeBuyer, isToronto, legalCosts, inspectionCost, movingCost, propertyTaxAdjustment, renovationBudget, annualRate, amortizationYears } = input;

  const cmhc = calculateCMHC({ purchasePrice, downPayment, amortizationYears });
  const ltt = calculateLandTransferTax({ purchasePrice, isToronto, isFirstTimeBuyer });
  const mortgage = calculateMortgage({ purchasePrice, downPayment: downPayment, annualRate, amortizationYears, frequency: "monthly" });
  const cmhcPremium = cmhc.premiumAmount || 0;
  const closingCosts = legalCosts + inspectionCost + movingCost + propertyTaxAdjustment + cmhcPremium + ltt.totalNet;
  const cashRequired = downPayment + closingCosts + renovationBudget;

  return {
    minimumDownPayment: cmhc.minimumDownPayment,
    mortgageAmount: purchasePrice - downPayment,
    cmhcPremium,
    landTransferTax: ltt.totalNet,
    lttBreakdown: ltt,
    closingCosts,
    cashRequired,
    monthlyPayment: mortgage.payment,
  };
}
