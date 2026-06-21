import type { Currency } from "@/types";
import { CURRENCY_RATES, CURRENCY_SYMBOLS } from "@/lib/config";

export function formatSalary(amount: number, currency: Currency, targetCurrency?: Currency): string {
  const displayCurrency = targetCurrency ?? currency;
  let value = amount;

  if (targetCurrency && targetCurrency !== currency) {
    const inINR = currency === "INR" ? amount : amount * CURRENCY_RATES[currency];
    value = targetCurrency === "INR" ? inINR : inINR / CURRENCY_RATES[targetCurrency];
  }

  const symbol = CURRENCY_SYMBOLS[displayCurrency];

  if (displayCurrency === "INR") {
    if (value >= 10000000) return `${symbol}${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `${symbol}${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `${symbol}${(value / 1000).toFixed(0)}K`;
    return `${symbol}${value.toLocaleString("en-IN")}`;
  }

  if (value >= 1000000) return `${symbol}${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${symbol}${(value / 1000).toFixed(0)}K`;
  return `${symbol}${value.toLocaleString()}`;
}

export function computeTC(base: number, bonus: number = 0, stock: number = 0): number {
  return base + bonus + stock;
}

export function computeMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
}

export function formatDelta(delta: number, currency: Currency): string {
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${formatSalary(Math.abs(delta), currency)}`;
}

export function toINRPaise(amount: number, currency: Currency): number {
  if (currency === "INR") return Math.round(amount);
  return Math.round(amount * CURRENCY_RATES[currency]);
}
