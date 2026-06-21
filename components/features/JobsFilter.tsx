"use client";

import { useState, useMemo } from "react";
import { IconShield, IconMapPin, IconArrowRight } from "@/components/ui/Icons";

const JOBS = [
  { id: 1, company: "Google", role: "Software Engineer L4", location: "Bengaluru", salary: "₹35L – ₹60L", type: "Full-time", posted: "2 days ago", tags: ["Backend", "Go", "Distributed Systems"], salaryVerified: true, level: "L4", experience: "3–6 yrs", category: "Engineering" },
  { id: 2, company: "Amazon", role: "SDE-II", location: "Bengaluru", salary: "₹28L – ₹50L", type: "Full-time", posted: "1 day ago", tags: ["Java", "AWS", "Microservices"], salaryVerified: true, level: "SDE-II", experience: "2–5 yrs", category: "Engineering" },
  { id: 3, company: "Flipkart", role: "Senior Data Scientist", location: "Bengaluru", salary: "₹30L – ₹55L", type: "Full-time", posted: "3 days ago", tags: ["Python", "ML", "Spark"], salaryVerified: true, level: "L5", experience: "4–7 yrs", category: "Data" },
  { id: 4, company: "Razorpay", role: "SDE-I", location: "Bengaluru", salary: "₹18L – ₹28L", type: "Full-time", posted: "1 week ago", tags: ["Node.js", "Payments", "API"], salaryVerified: false, level: "SDE-I", experience: "0–2 yrs", category: "Engineering" },
  { id: 5, company: "Microsoft", role: "Product Manager", location: "Hyderabad", salary: "₹32L – ₹55L", type: "Full-time", posted: "4 days ago", tags: ["Azure", "B2B", "SaaS"], salaryVerified: true, level: "L60", experience: "4–8 yrs", category: "Product" },
  { id: 6, company: "NVIDIA", role: "Software Engineer", location: "Bengaluru", salary: "₹45L – ₹90L", type: "Full-time", posted: "5 days ago", tags: ["CUDA", "C++", "GPU"], salaryVerified: true, level: "Senior", experience: "5–10 yrs", category: "Engineering" },
  { id: 7, company: "Meesho", role: "Data Analyst", location: "Bengaluru", salary: "₹14L – ₹22L", type: "Full-time", posted: "2 days ago", tags: ["SQL", "Tableau", "Python"], salaryVerified: false, level: "Junior", experience: "1–3 yrs", category: "Data" },
  { id: 8, company: "Zepto", role: "Engineering Manager", location: "Mumbai", salary: "₹55L – ₹95L", type: "Full-time", posted: "6 days ago", tags: ["Leadership", "Infra", "Scaling"], salaryVerified: true, level: "Manager", experience: "8–12 yrs", category: "Engineering" },
  { id: 9, company: "PhonePe", role: "Product Manager", location: "Bengaluru", salary: "₹28L – ₹50L", type: "Full-time", posted: "3 days ago", tags: ["Fintech", "UPI", "Consumer"], salaryVerified: true, level: "PM2", experience: "3–6 yrs", category: "Product" },
  { id: 10, company: "Swiggy", role: "Backend Engineer", location: "Bengaluru", salary: "₹22L – ₹38L", type: "Full-time", posted: "Today", tags: ["Go", "gRPC", "Kafka"], salaryVerified: false, level: "SDE-II", experience: "2–4 yrs", category: "Engineering" },
  { id: 11, company: "Atlassian", role: "Senior Software Engineer", location: "Remote", salary: "₹60L – ₹110L", type: "Remote", posted: "1 week ago", tags: ["Kotlin", "Cloud", "Platform"], salaryVerified: true, level: "Senior", experience: "5–8 yrs", category: "Engineering" },
  { id: 12, company: "Groww", role: "ML Engineer", location: "Bengaluru", salary: "₹25L – ₹45L", type: "Full-time", posted: "4 days ago", tags: ["PyTorch", "NLP", "Recommendation"], salaryVerified: true, level: "SDE-II", experience: "2–5 yrs", category: "Data" },
];

const CATEGORIES = ["All", "Engineering", "Data", "Product"] as const;
type Category = (typeof CATEGORIES)[number];

const COMPANY_INITIALS: Record<string, string> = { Google: "G", Amazon: "A", Flipkart: "F", Razorpay: "R", Microsoft: "M", NVIDIA: "NV", Meesho: "Me", Zepto: "Z", PhonePe: "PP", Swiggy: "Sw", Atlassian: "At", Groww: "Gr" };
const COMPANY_COLORS: Record<string, string> = { Google: "bg-blue-50 text-blue-700", Amazon: "bg-orange-50 text-orange-700", Flipkart: "bg-indigo-50 text-indigo-700", Razorpay: "bg-sky-50 text-sky-700", Microsoft: "bg-green-50 text-green-700", NVIDIA: "bg-emerald-50 text-emerald-700", Meesho: "bg-purple-50 text-purple-700", Zepto: "bg-yellow-50 text-yellow-700", PhonePe: "bg-violet-50 text-violet-700", Swiggy: "bg-orange-50 text-orange-600", Atlassian: "bg-blue-50 text-blue-800", Groww: "bg-teal-50 text-teal-700" };

export function JobsFilter() {
  const [category, setCategory] = useState<Category>("All");

  const filtered = useMemo(
    () => category === "All" ? JOBS : JOBS.filter((j) => j.category === category),
    [category]
  );

  const salaryVerifiedCount = filtered.filter((j) => j.salaryVerified).length;
  const companiesCount = new Set(filtered.map((j) => j.company)).size;

  return (
    <>
      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Open Roles", value: `${filtered.length}` },
          { label: "Salary Verified", value: `${salaryVerifiedCount}` },
          { label: "Companies Hiring", value: `${companiesCount}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-[#EBEBEB] rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-[#222222]">{value}</p>
            <p className="text-xs text-[#717171] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#FFF5F5] border border-[#FFE0E0] rounded-xl p-4 mb-6 flex items-start gap-3">
        <span className="shrink-0 w-5 h-5 rounded-full bg-[#FF5A5F] flex items-center justify-center text-white text-xs font-bold mt-0.5">!</span>
        <div>
          <span className="font-medium text-[#222222] text-sm">Live integration coming soon.</span>
          <span className="text-sm text-[#717171]"> Listings are benchmarked using TalentDash salary data.</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          {/* Category tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-[#FF5A5F] text-white"
                    : "bg-white border border-[#EBEBEB] text-[#484848] hover:border-[#FF5A5F] hover:text-[#FF5A5F]"
                }`}
              >
                {cat}
                {cat !== "All" && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({JOBS.filter((j) => j.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((job) => (
              <div key={job.id} className="bg-white border border-[#EBEBEB] rounded-xl p-5 hover:border-[#FF5A5F] hover:shadow-sm transition-all group">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${COMPANY_COLORS[job.company] ?? "bg-[#F7F7F7] text-[#222222]"}`}>
                    {COMPANY_INITIALS[job.company] ?? job.company.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-[#222222] group-hover:text-[#FF5A5F] transition-colors">{job.role}</h3>
                        <p className="text-sm text-[#717171] mt-0.5">{job.company} · {job.location} · {job.experience}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[#0369A1]">{job.salary}</p>
                        <p className="text-xs text-[#717171] mt-0.5">{job.posted}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="text-xs px-2 py-0.5 bg-[#F7F7F7] border border-[#EBEBEB] text-[#717171] rounded-full">{job.type}</span>
                      <span className="text-xs px-2 py-0.5 bg-[#F7F7F7] border border-[#EBEBEB] text-[#717171] rounded-full">{job.level}</span>
                      {job.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-[#F7F7F7] text-[#717171] rounded-full">{tag}</span>
                      ))}
                      {job.salaryVerified && (
                        <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-green-50 text-[#008A05] border border-green-100 rounded-full font-medium">
                          <IconShield className="w-3 h-3" /> Salary Verified
                        </span>
                      )}
                      <a
                        href={`/salaries?company=${encodeURIComponent(job.company)}`}
                        className="ml-auto text-xs px-3 py-1 bg-[#FF5A5F] text-white font-medium rounded-full hover:bg-[#e84f54] transition-colors"
                      >
                        Apply
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-72 space-y-4 shrink-0">
          <div className="hidden lg:block bg-white border border-[#EBEBEB] rounded-xl p-5">
            <h3 className="font-semibold text-[#222222] mb-3 text-sm">What is Salary Verified?</h3>
            <p className="text-xs text-[#717171] leading-relaxed">
              Roles marked <span className="text-[#008A05] font-medium">Salary Verified</span> have their salary range cross-referenced against real compensation data contributed by TalentDash users.
            </p>
          </div>
          <div className="hidden lg:block bg-white border border-[#EBEBEB] rounded-xl p-5">
            <h3 className="font-semibold text-[#222222] mb-3 text-sm">Top Hiring Cities</h3>
            <ul className="space-y-2">
              {[["Bengaluru", 8], ["Hyderabad", 2], ["Mumbai", 1], ["Remote", 1]].map(([city, count]) => (
                <li key={city} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-[#484848]">
                    <IconMapPin className="w-3.5 h-3.5 text-[#717171]" />{city}
                  </span>
                  <span className="text-xs text-[#717171] bg-[#F7F7F7] px-2 py-0.5 rounded-full">{count} roles</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden lg:block bg-[#222222] rounded-xl p-5">
            <h3 className="font-semibold text-white mb-2 text-sm">Know your market rate?</h3>
            <p className="text-xs text-[#717171] mb-4 leading-relaxed">Check what peers at the same level are earning before you apply.</p>
            <a href="/salaries" className="inline-flex items-center gap-1.5 text-xs text-white font-medium bg-[#FF5A5F] px-3 py-2 rounded-lg hover:bg-[#e84f54] transition-colors">
              Browse Salaries <IconArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
