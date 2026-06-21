import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { InterviewCard } from "@/components/features/InterviewCard";
import { notFound } from "next/navigation";
import type { Interview } from "@/types";

export const revalidate = 86400;

export async function generateStaticParams() {
  const companies = await prisma.company.findMany({ select: { slug: true } });
  return companies.map((c) => ({ company: c.slug }));
}

type Props = { params: Promise<{ company: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { company: slug } = await params;
  const company = await prisma.company.findUnique({ where: { slug } });
  if (!company) return { title: "Not Found" };
  return { title: `${company.name} Interview Questions & Experiences | TalentDash` };
}

export default async function CompanyInterviewsPage({ params }: Props) {
  const { company: slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
    include: { interviews: { orderBy: { submitted_at: "desc" } } },
  });
  if (!company) notFound();

  const interviews: Interview[] = company.interviews.map((i) => ({
    ...i,
    submitted_at: i.submitted_at.toISOString(),
    rounds: i.rounds as Interview["rounds"],
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-[#222222] mb-2">{company.name} Interviews</h1>
      <p className="text-[#717171] mb-8">{interviews.length} interview experiences</p>
      <div className="grid md:grid-cols-2 gap-4">
        {interviews.map((i) => <InterviewCard key={i.id} interview={i} companyName={company.name} companySlug={company.slug} />)}
      </div>
      {interviews.length === 0 && <p className="text-center text-[#717171] py-16">No interview experiences for {company.name} yet.</p>}
    </div>
  );
}
