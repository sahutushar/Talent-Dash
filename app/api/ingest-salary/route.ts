import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizeCompanyName, toSlug } from "@/lib/normalize";
import type { IngestSalaryInput } from "@/types";

const VALID_LEVELS = ["L3","L4","L5","L6","SDE_I","SDE_II","SDE_III","STAFF","PRINCIPAL","IC4","IC5"];
const VALID_CURRENCIES = ["INR","USD","GBP","EUR"];
const VALID_SOURCES = ["CONTRIBUTOR","SCRAPED","AI_INFERRED"];

export async function POST(req: NextRequest) {
  let body: IngestSalaryInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: true, message: "Invalid JSON body" }, { status: 400 });
  }

  // Required field validation
  const required = ["company","role","level","location","currency","experience_years","base_salary","source","confidence_score"] as const;
  for (const field of required) {
    if (body[field] == null || body[field] === "") {
      return NextResponse.json({ error: true, field, message: `${field} is required` }, { status: 400 });
    }
  }

  if (!VALID_LEVELS.includes(body.level)) {
    return NextResponse.json({ error: true, field: "level", message: `Level must be one of: ${VALID_LEVELS.join(", ")}` }, { status: 400 });
  }
  if (!VALID_CURRENCIES.includes(body.currency)) {
    return NextResponse.json({ error: true, field: "currency", message: `Currency must be one of: ${VALID_CURRENCIES.join(", ")}` }, { status: 400 });
  }
  if (!VALID_SOURCES.includes(body.source)) {
    return NextResponse.json({ error: true, field: "source", message: `Source must be one of: ${VALID_SOURCES.join(", ")}` }, { status: 400 });
  }
  if (!Number.isInteger(body.experience_years) || body.experience_years <= 0 || body.experience_years >= 51) {
    return NextResponse.json({ error: true, field: "experience_years", message: "experience_years must be an integer between 1 and 50" }, { status: 400 });
  }
  if (typeof body.base_salary !== "number" || body.base_salary <= 0) {
    return NextResponse.json({ error: true, field: "base_salary", message: "base_salary must be a positive number" }, { status: 400 });
  }
  if (typeof body.confidence_score !== "number" || body.confidence_score < 0 || body.confidence_score > 1) {
    return NextResponse.json({ error: true, field: "confidence_score", message: "confidence_score must be between 0.0 and 1.0" }, { status: 400 });
  }

  // Normalize company
  const normalizedName = normalizeCompanyName(body.company);
  const slug = toSlug(normalizedName);

  // Find or create company
  let company = await prisma.company.findUnique({ where: { slug } });
  if (!company) {
    company = await prisma.company.create({
      data: {
        name: body.company.trim(),
        slug,
        normalized_name: normalizedName,
      },
    });
  }

  // Compute TC server-side (never trust client)
  const bonus = Math.round(body.bonus ?? 0);
  const stock = Math.round(body.stock ?? 0);
  const base = Math.round(body.base_salary);
  const total_compensation = base + bonus + stock;

  // Duplicate check: same company + role + level + location, base within 10%, last 48h
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const existing = await prisma.salary.findFirst({
    where: {
      company_id: company.id,
      role: body.role,
      level: body.level as never,
      location: body.location,
      submitted_at: { gte: cutoff },
    },
  });
  if (existing) {
    const existingBase = Number(existing.base_salary);
    const diff = Math.abs(existingBase - base) / existingBase;
    if (diff <= 0.1) {
      return NextResponse.json({ error: true, message: "Duplicate record: similar salary submitted in the last 48 hours" }, { status: 409 });
    }
  }

  const salary = await prisma.salary.create({
    data: {
      company_id: company.id,
      role: body.role,
      level: body.level as never,
      location: body.location,
      currency: body.currency as never,
      experience_years: body.experience_years,
      base_salary: base,
      bonus,
      stock,
      total_compensation,
      source: body.source as never,
      confidence_score: body.confidence_score,
      is_verified: false,
    },
    include: { company: true },
  });

  return NextResponse.json({
    ...salary,
    base_salary: Number(salary.base_salary),
    bonus: Number(salary.bonus),
    stock: Number(salary.stock),
    total_compensation: Number(salary.total_compensation),
  }, { status: 201 });
}
