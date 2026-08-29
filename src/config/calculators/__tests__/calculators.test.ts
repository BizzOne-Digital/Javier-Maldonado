import { describe, it, expect } from "vitest";
import { calculateCMHC, calculateMinimumDownPayment } from "../cmhc";
import { calculateLandTransferTax } from "../landTransferTax";
import { calculateMortgage } from "../mortgage";

describe("CMHC Calculator", () => {
  it("calculates minimum down payment for $600k", () => {
    expect(calculateMinimumDownPayment(600_000)).toBe(35_000);
  });

  it("calculates premium for 90% LTV", () => {
    const result = calculateCMHC({ purchasePrice: 500_000, downPayment: 50_000, amortizationYears: 25 });
    expect(result.eligible).toBe(true);
    expect(result.premiumRate).toBeGreaterThan(0);
  });
});

describe("Land Transfer Tax", () => {
  it("calculates Ontario tax only for Mississauga", () => {
    const result = calculateLandTransferTax({ purchasePrice: 800_000, isToronto: false, isFirstTimeBuyer: false });
    expect(result.municipalTax).toBe(0);
    expect(result.provincialTax).toBeGreaterThan(0);
  });

  it("includes Toronto MLTT for Toronto property", () => {
    const result = calculateLandTransferTax({ purchasePrice: 800_000, isToronto: true, isFirstTimeBuyer: true });
    expect(result.municipalTax).toBeGreaterThan(0);
    expect(result.provincialRefund).toBeGreaterThan(0);
  });
});

describe("Mortgage Calculator", () => {
  it("calculates monthly payment", () => {
    const result = calculateMortgage({
      purchasePrice: 700_000,
      downPayment: 140_000,
      annualRate: 5.5,
      amortizationYears: 25,
      frequency: "monthly",
    });
    expect(result.payment).toBeGreaterThan(0);
    expect(result.mortgageAmount).toBe(560_000);
  });
});
