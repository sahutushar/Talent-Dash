export type Level =
  | "L3" | "L4" | "L5" | "L6"
  | "SDE_I" | "SDE_II" | "SDE_III"
  | "STAFF" | "PRINCIPAL" | "IC4" | "IC5";

export type Currency = "INR" | "USD" | "GBP" | "EUR";
export type SalarySource = "CONTRIBUTOR" | "SCRAPED" | "AI_INFERRED";
export type InterviewDifficulty = "EASY" | "MEDIUM" | "HARD" | "VERY_HARD";
export type InterviewOutcome = "OFFER" | "REJECT" | "GHOSTED" | "WITHDREW";

export interface Company {
  id: string;
  name: string;
  slug: string;
  normalized_name: string;
  industry?: string | null;
  headquarters?: string | null;
  founded_year?: number | null;
  headcount_range?: string | null;
  logo_url?: string | null;
  website?: string | null;
  funding_stage?: string | null;
  description?: string | null;
  glassdoor_rating?: number | null;
  ambitionbox_rating?: number | null;
  talentdash_score?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Salary {
  id: string;
  company_id: string;
  company?: Company;
  role: string;
  level: Level;
  location: string;
  currency: Currency;
  experience_years: number;
  base_salary: number;
  bonus: number;
  stock: number;
  total_compensation: number;
  source: SalarySource;
  confidence_score: number;
  is_verified: boolean;
  submitted_at: string;
}

export interface Review {
  id: string;
  company_id: string;
  company?: Company;
  role?: string | null;
  level?: Level | null;
  location?: string | null;
  rating_overall: number;
  rating_wlb?: number | null;
  rating_growth?: number | null;
  rating_mgmt?: number | null;
  rating_culture?: number | null;
  rating_compensation?: number | null;
  title: string;
  pros?: string | null;
  cons?: string | null;
  would_recommend: boolean;
  is_anonymous: boolean;
  is_verified: boolean;
  submitted_at: string;
}

export interface InterviewRound {
  round: number;
  type: string;
  description: string;
}

export interface Interview {
  id: string;
  company_id: string;
  company?: Company;
  role: string;
  level?: Level | null;
  location?: string | null;
  difficulty: InterviewDifficulty;
  outcome: InterviewOutcome;
  rounds?: InterviewRound[] | null;
  tips?: string | null;
  years_experience?: number | null;
  is_verified: boolean;
  submitted_at: string;
}

export interface WorkplaceScore {
  id: string;
  company_id: string;
  score_compensation: number;
  score_wlb: number;
  score_growth: number;
  score_culture: number;
  score_dei: number;
  score_remote: number;
  composite_score: number;
  computed_at: string;
}

export interface SalaryFilters {
  company?: string;
  role?: string;
  level?: Level;
  location?: string;
  currency?: Currency;
  sort?: "total_comp_desc" | "total_comp_asc" | "date_desc";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface CompanyWithStats extends Company {
  median_total_compensation: number;
  level_distribution: Partial<Record<Level, number>>;
  salaries: Salary[];
  reviews: Review[];
  interviews: Interview[];
  workplace_score?: WorkplaceScore | null;
  salary_count: number;
}

export interface CompareDelta {
  base_delta: number;
  bonus_delta: number;
  stock_delta: number;
  tc_delta: number;
  experience_delta: number;
}

export interface IngestSalaryInput {
  company: string;
  role: string;
  level: Level;
  location: string;
  currency: Currency;
  experience_years: number;
  base_salary: number;
  bonus?: number;
  stock?: number;
  source: SalarySource;
  confidence_score: number;
}
