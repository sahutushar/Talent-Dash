import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const s1 = req.nextUrl.searchParams.get("s1");
  const s2 = req.nextUrl.searchParams.get("s2");

  if (!s1 || !s2) {
    return NextResponse.json({ error: true, message: "Both s1 and s2 query params are required" }, { status: 400 });
  }
  if (s1 === s2) {
    return NextResponse.json({ error: true, message: "s1 and s2 must be different records" }, { status: 400 });
  }

  const [r1, r2] = await Promise.all([
    prisma.salary.findUnique({ where: { id: s1 }, include: { company: true } }),
    prisma.salary.findUnique({ where: { id: s2 }, include: { company: true } }),
  ]);

  if (!r1) return NextResponse.json({ error: true, message: `Record s1 (${s1}) not found` }, { status: 404 });
  if (!r2) return NextResponse.json({ error: true, message: `Record s2 (${s2}) not found` }, { status: 404 });

  const n = (v: bigint) => Number(v);
  const record1 = { ...r1, base_salary: n(r1.base_salary), bonus: n(r1.bonus), stock: n(r1.stock), total_compensation: n(r1.total_compensation), confidence_score: Number(r1.confidence_score) };
  const record2 = { ...r2, base_salary: n(r2.base_salary), bonus: n(r2.bonus), stock: n(r2.stock), total_compensation: n(r2.total_compensation), confidence_score: Number(r2.confidence_score) };

  const delta = {
    base_delta: record1.base_salary - record2.base_salary,
    bonus_delta: record1.bonus - record2.bonus,
    stock_delta: record1.stock - record2.stock,
    tc_delta: record1.total_compensation - record2.total_compensation,
    experience_delta: record1.experience_years - record2.experience_years,
  };

  return NextResponse.json({ record1, record2, delta });
}
