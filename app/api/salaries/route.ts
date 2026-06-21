import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;

  const company = p.get("company") ?? undefined;
  const role = p.get("role") ?? undefined;
  const level = p.get("level") ?? undefined;
  const location = p.get("location") ?? undefined;
  const currency = p.get("currency") ?? undefined;
  const sort = p.get("sort") ?? "total_comp_desc";
  const page = Math.max(1, parseInt(p.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, parseInt(p.get("limit") ?? "25")));

  const where: Record<string, unknown> = {};
  if (company) where.company = { normalized_name: { contains: company.toLowerCase() } };
  if (role) where.role = { contains: role, mode: "insensitive" };
  if (level) where.level = level;
  if (location) where.location = { contains: location, mode: "insensitive" };
  if (currency) where.currency = currency;

  const orderBy =
    sort === "total_comp_asc" ? { total_compensation: "asc" as const } :
    sort === "date_desc" ? { submitted_at: "desc" as const } :
    { total_compensation: "desc" as const };

  const [total, salaries] = await Promise.all([
    prisma.salary.count({ where }),
    prisma.salary.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { company: true },
    }),
  ]);

  const data = salaries.map((s) => ({
    ...s,
    base_salary: Number(s.base_salary),
    bonus: Number(s.bonus),
    stock: Number(s.stock),
    total_compensation: Number(s.total_compensation),
    confidence_score: Number(s.confidence_score),
  }));

  return NextResponse.json(
    { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=3600" } }
  );
}
