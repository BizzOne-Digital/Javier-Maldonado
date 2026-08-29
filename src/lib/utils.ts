export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number, locale = "en-CA") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number, locale = "en-CA") {
  return new Intl.NumberFormat(locale).format(value);
}
