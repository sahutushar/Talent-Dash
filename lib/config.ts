import type { Level, Currency } from "@/types";

export const LEVEL_LABELS: Record<Level, string> = {
  L3: "L3", L4: "L4", L5: "L5", L6: "L6",
  SDE_I: "SDE-I", SDE_II: "SDE-II", SDE_III: "SDE-III",
  STAFF: "Staff", PRINCIPAL: "Principal", IC4: "IC4", IC5: "IC5",
};

export const LEVEL_COLORS: Record<Level, string> = {
  L3: "bg-slate-100 text-slate-700",
  SDE_I: "bg-slate-100 text-slate-700",
  L4: "bg-blue-100 text-blue-700",
  SDE_II: "bg-blue-100 text-blue-700",
  L5: "bg-indigo-100 text-indigo-700",
  SDE_III: "bg-indigo-100 text-indigo-700",
  L6: "bg-purple-100 text-purple-700",
  STAFF: "bg-purple-100 text-purple-700",
  PRINCIPAL: "bg-[#dbeafe] text-[#1e3a5f]",
  IC4: "bg-violet-100 text-violet-700",
  IC5: "bg-fuchsia-100 text-fuchsia-700",
};

export const ALL_LEVELS: Level[] = [
  "L3", "SDE_I", "L4", "SDE_II", "L5", "SDE_III", "L6", "STAFF", "PRINCIPAL", "IC4", "IC5",
];

export const CURRENCY_RATES: Record<Currency, number> = {
  INR: 1,
  USD: 83.5,
  GBP: 105.2,
  EUR: 90.1,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: "₹", USD: "$", GBP: "£", EUR: "€",
};

export const COLORS = {
  primary: "#FF5A5F",
  deepText: "#222222",
  bodyText: "#484848",
  mutedText: "#717171",
  surface: "#FFFFFF",
  appBg: "#F7F7F7",
  border: "#EBEBEB",
  success: "#008A05",
  warning: "#FFB400",
  error: "#D93025",
  hover: "#F2F2F2",
  dataBlue: "#0369A1",
};

export const LOCATIONS = [
  "Bengaluru", "Mumbai", "Hyderabad", "Pune", "Delhi", "Chennai",
  "Kolkata", "Noida", "Gurgaon", "Ahmedabad", "Remote",
  "San Francisco", "Seattle", "New York", "London",
];

export const INDUSTRIES = [
  "Technology", "E-commerce", "Fintech", "Edtech", "Healthtech",
  "Consulting", "Banking", "FMCG", "Telecom", "Logistics",
  "Gaming", "Media", "SaaS", "Cloud", "Semiconductor",
];
