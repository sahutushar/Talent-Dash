# TalentDash

Career intelligence platform for India's tech professionals. Real salary data, company reviews, interview experiences — structured, comparable, decision-ready.

**Live URL:** https://talent-dash-nzcn.vercel.app/

> Built as a Full-Stack Engineering Trial. The product core: structured data → comparable → decision-ready.

---

## Running Locally in Under 5 Minutes

### 1. Clone & Install

```bash
git clone <repo-url>
cd talentdash-app
npm install
```

### 2. Configure Environment

Create `.env` in the project root:

```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/talentdash?sslmode=require"
```

Get a free connection string from [console.neon.tech](https://console.neon.tech) → New Project → Copy connection string.

### 3. Migrate & Seed

```bash
npx prisma migrate deploy    # Run all migrations, create tables
npm run db:seed              # Seeds 25 companies, 100+ salaries, reviews, interviews, workplace scores
```

### 4. Start

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The salary table, company pages, and compare tool all load from the seeded database.

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require` |

See `.env.example` for the template.

---

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | Next.js 16 — App Router only | RSC + `generateStaticParams` powers the static page engine. Pages Router not used. |
| Language | TypeScript (strict mode) | Type-safe throughout — schema, API contracts, component props |
| Styling | Tailwind CSS v4 — no component libraries | No ShadCN, MUI, or Radix. Utility classes written from scratch. |
| Database | PostgreSQL via [Neon](https://neon.tech) (serverless) | Structured relational data, excellent full-text search, free tier covers MVP |
| ORM | Prisma 6 | Type-safe queries, migration history in source control, schema-as-code |
| Validation | Zod | API input validation with per-field error messages |
| Hosting | Vercel | Edge-optimised, ISR-native, integrates with `vercel.json` build config |
| Build | `npx prisma generate && next build` | Prisma client is always regenerated before the Next.js build |

---

## Project Structure

```
talentdash-app/
├── app/
│   ├── api/
│   │   ├── ingest-salary/      # POST — validate, normalise, deduplicate, store
│   │   ├── salaries/           # GET — filter, sort, paginate
│   │   ├── companies/          # GET — list + slug detail with median TC
│   │   ├── reviews/            # GET — by company
│   │   ├── interviews/         # GET — by company
│   │   └── compare/            # GET — two records + delta object
│   ├── companies/[slug]/       # SSG — generateStaticParams from live DB
│   ├── salaries/[role]/        # ISR — core SEO salary pages
│   ├── reviews/[company]/      # ISR — company review pages
│   ├── interviews/[company]/   # Static — experience reports
│   ├── compare/                # Client Component — URL-state driven
│   ├── tools/
│   │   ├── salary-calculator/
│   │   ├── offer-comparison/
│   │   ├── hike-calculator/
│   │   └── equity-calculator/
│   ├── jobs/
│   ├── community/
│   └── workplace-index/
├── components/
│   ├── features/               # SalaryTable, CompanyCard, ReviewCard, FilterBar, etc.
│   └── ui/                     # Badge, Button, Pagination, StarRating, Skeleton, etc.
├── lib/
│   ├── db.ts                   # Prisma client singleton
│   ├── salary.ts               # formatSalary(), computeMedian()
│   ├── normalize.ts            # normalizeCompanyName(), toSlug()
│   └── config.ts               # Level labels/colors, currency rates, location list
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts                 # 25 companies, 100+ salaries, reviews, interviews
└── types/
    └── index.ts
```

---

## Database Schema

Five models. All relationships are explicit foreign keys — company name is never stored as a raw string on a salary record.

```
Company         id, name, slug (unique), normalized_name (indexed), industry, headquarters,
                founded_year, headcount_range, glassdoor_rating, ambitionbox_rating,
                talentdash_score, logo_url, website, funding_stage, description

Salary          id, company_id → Company, role, level (enum), location, currency (enum),
                experience_years, base_salary (bigint), bonus (bigint), stock (bigint),
                total_compensation (bigint — always server-computed), source (enum),
                confidence_score (Decimal 0–1), is_verified, submitted_at

Review          id, company_id → Company, role, level, location, rating_overall,
                rating_wlb, rating_growth, rating_mgmt, rating_culture, rating_compensation,
                title, pros, cons, would_recommend, is_anonymous, is_verified, submitted_at

Interview       id, company_id → Company, role, level, location, difficulty (enum),
                outcome (enum), rounds (JSON), tips, years_experience, is_verified, submitted_at

WorkplaceScore  id, company_id → Company (unique), score_compensation, score_wlb,
                score_growth, score_culture, score_dei, score_remote, composite_score,
                computed_at
```

**Enums:**
- `Level`: L3, L4, L5, L6, SDE_I, SDE_II, SDE_III, STAFF, PRINCIPAL, IC4, IC5
- `Currency`: INR, USD, GBP, EUR
- `SalarySource`: CONTRIBUTOR, SCRAPED, AI_INFERRED
- `InterviewDifficulty`: EASY, MEDIUM, HARD, VERY_HARD
- `InterviewOutcome`: OFFER, REJECT, GHOSTED, WITHDREW

**Indexes:**
- `@@index([company_id, level, location])` — primary filter path
- `@@index([total_compensation])` — sort path
- `@@index([submitted_at])` — recency sort
- `@@index([location, level])` — geo-level filter
- `@@index([normalized_name])` — company lookup on ingest

> `total_compensation` is **always computed server-side** as `base_salary + bonus + stock`. The ingest endpoint strips and recomputes this field on every POST, regardless of what the client submits.

---

## Data Contract

Every salary record must satisfy:

| Field | Rule |
|-------|------|
| `company` | Required. Normalised to lowercase + trimmed + legal suffixes stripped before DB lookup. |
| `level` | Must be one of the 11 enum values. Free text like `"Senior Engineer"` is rejected with `400`. |
| `experience_years` | Integer, 1–50. Rejected if ≤ 0 or ≥ 51. |
| `base_salary` | Positive integer. Annual gross in smallest currency unit (paise for INR). |
| `bonus` / `stock` | Optional, defaults to `0`. Never `null` in DB. |
| `total_compensation` | Server-computed. Never trusted from client input. |
| `confidence_score` | Float 0.0–1.0. Rejected outside range. |
| `source` | CONTRIBUTOR / SCRAPED / AI_INFERRED |
| `submitted_at` | Server-side timestamp. Client value stripped. |

---

## Rendering Strategy

| Page | Strategy | Reason |
|------|----------|--------|
| `/` | ISR (3600s) | Trending companies change daily |
| `/companies` | ISR (3600s) | Company list updates with new slugs |
| `/companies/[slug]` | SSG + `generateStaticParams` | Pre-built at deploy time from live DB query |
| `/salaries` | ISR (300s) | Core SEO page — refreshes frequently, must rank fast |
| `/salaries/[role]` | Static | Per-role salary pages are core SEO assets |
| `/reviews/[company]` | ISR (7200s) | New reviews added, not real-time critical |
| `/interviews/[company]` | Static | Experience reports rarely change |
| `/compare` | Client Component (`'use client'`) | Pure URL state, no server data — only justified `use client` in the codebase |
| `/tools/*` | Static shell + client hydration | Tool UI is static; calculations are client-side JS |
| `/community` | Static shell | Forum backend not wired — structure exists |
| API reads | `s-maxage=300, stale-while-revalidate=3600` | CDN caches read responses; background revalidation keeps data fresh |
| API writes | No cache | Data integrity — mutations must never be served stale |

**Why `s-maxage=300, stale-while-revalidate=3600` on reads?**
`s-maxage=300` means Cloudflare serves the cached response for 5 minutes before revalidating. `stale-while-revalidate=3600` allows Cloudflare to serve the stale response for up to 1 hour while it fetches a fresh one in the background. Users never wait for a cold cache hit. TTLs are set conservatively — salary data changes less frequently than 5 minutes, so 300s avoids unnecessary DB hits without showing stale data.

**Why page-based pagination over cursor-based?**
Users need to jump to `page 3 of 12` — cursor pagination doesn't support random access. Salary explorer is the primary use case where users browse pages, not infinite scroll. URLs like `/salaries?page=3` are bookmarkable and shareable, which matters for SEO link equity. Trade-off: page-based is less efficient at deep pagination (page 1000+). At current data scale (&lt;100K records), this is not an issue.

---

## API Reference

### `POST /api/ingest-salary`

Validate → normalise → deduplicate → store. `total_compensation` is always recomputed.

```json
{
  "company": "Google",
  "role": "Software Engineer",
  "level": "L4",
  "location": "Bengaluru",
  "currency": "INR",
  "experience_years": 5,
  "base_salary": 3500000,
  "bonus": 700000,
  "stock": 2000000,
  "source": "CONTRIBUTOR",
  "confidence_score": 0.9
}
```

Responses:
- `201 Created` — full stored record with server-computed `total_compensation`
- `400 Bad Request` — `{ error: true, field: "level", message: "Level must be one of: L3, L4..." }` per-field errors
- `409 Conflict` — duplicate: same company + role + level + location, base within 10%, last 48h

Validation pipeline (in order):
1. Required fields present
2. Types correct
3. `level` is valid enum value
4. `experience_years` > 0 and < 51
5. `base_salary` > 0
6. `confidence_score` between 0.0 and 1.0
7. Duplicate check against last 48h window

### `GET /api/salaries`

```
?company=google&role=engineer&level=L4&location=Bengaluru
&currency=INR&sort=total_comp_desc&page=1&limit=25
```

- `company` and `role` use PostgreSQL `ILIKE` — case-insensitive partial match
- `level` and `currency` are exact enum matches
- `sort`: `total_comp_desc` (default) | `total_comp_asc` | `date_desc`
- `limit` is capped at 100 — unbounded queries are rejected
- Returns `{ data: [...], meta: { total, page, limit, totalPages } }`
- Cache-Control: `s-maxage=300, stale-while-revalidate=3600`

### `GET /api/companies/[slug]`

Returns company metadata + full salary list + `median_total_compensation` (true statistical median, not average) + `level_distribution` object.

```json
{
  "company": { "name": "Google", "slug": "google", ... },
  "salaries": [...],
  "median_total_compensation": 6200000,
  "level_distribution": { "L4": 12, "L5": 8, "STAFF": 3 }
}
```

- `404` with `{ error: true, message: "Company not found" }` for unknown slugs
- Salary list sorted by `total_compensation` descending
- Cache-Control: `s-maxage=3600, stale-while-revalidate=86400`

### `GET /api/compare`

```
?s1={uuid}&s2={uuid}
```

Returns both full records + delta object:

```json
{
  "record1": { ... },
  "record2": { ... },
  "delta": {
    "base_delta": 500000,
    "bonus_delta": 100000,
    "stock_delta": 200000,
    "tc_delta": 800000,
    "experience_delta": 2
  }
}
```

- Delta = `record1_value − record2_value`. Positive = record 1 is higher.
- `400` if `s1 === s2`
- `404` if either ID is not found

### `GET /api/reviews`

```
?company={slug}&page=1&limit=25
```

### `GET /api/interviews`

```
?company={slug}&page=1&limit=25
```

---

## Seed Data

`prisma/seed.ts` seeds:

- **25 companies** — Google, Amazon, Meta, Microsoft, Flipkart, Meesho, NVIDIA, TCS, Infosys, Wipro, Razorpay, Zepto, Swiggy, Ola, PhonePe, Paytm, Atlassian, Dunzo, Zomato, Uber, Salesforce, Adobe, Groww, CRED, HCL
- **100+ salary records** — spans all 11 levels, cities (Bengaluru, Mumbai, Hyderabad, Pune, Delhi, Noida, Gurugram, Chennai, San Francisco, Seattle, New York, London), INR + USD + GBP
- **Reviews** — per-dimension ratings (WLB, growth, mgmt, culture, compensation) with pros/cons
- **Interview experiences** — with round-by-round JSON breakdown and outcome
- **WorkplaceScore** — 6-dimension scores with composite (weighted: comp×0.3, wlb×0.2, growth×0.25, culture×0.15, dei×0.05, remote×0.05)
- **Edge cases included:** one record with zero bonus, one with zero stock, one with very high equity (NVIDIA Principal: ₹4Cr stock), Principal level record, GBP currency record

---

## NPM Scripts

```bash
npm run dev           # Development server (http://localhost:3000)
npm run build         # Production build (runs prisma generate first via vercel.json)
npm run start         # Production server
npm run lint          # ESLint check
npm run db:generate   # Regenerate Prisma client after schema changes
npm run db:migrate    # Create and run a new migration (dev only)
npm run db:push       # Push schema without migration file (prototyping)
npm run db:seed       # Seed the database
npx prisma studio     # Open Prisma GUI (http://localhost:5555)
```

---

## Deployment (Vercel)

```bash
npm install -g vercel
vercel
```

Add `DATABASE_URL` in Vercel dashboard → Settings → Environment Variables, then:

```bash
vercel --prod
```

`vercel.json` sets `buildCommand: "npx prisma generate && next build"` — the Prisma client is always regenerated before the build so generated types match the deployed schema.

---

## Architecture Decisions

### Static vs ISR vs Dynamic — per page

`/companies/[slug]` is fully static via `generateStaticParams()` which queries the Neon database at build time to get all real slugs. Not a hardcoded array — if a new company is added to the DB, the next deployment automatically adds that company page. Company pages change rarely (metadata updates are infrequent), so SSG is the right call: fastest possible LCP, zero DB hit per request.

`/salaries` is ISR at 300s because it's the highest-traffic SEO page and new salary records are ingested continuously. 5 minutes is an acceptable staleness window for a compensation explorer — users do not expect real-time data.

`/compare` is the only justified `'use client'` in the entire codebase. It manages two dropdown selectors, the delta calculation, and URL state — all of which are pure client interactions. There is no server data to prerender. Making it a server component would require full-page navigation for every selection change.

### Page-based vs cursor-based pagination

Page-based pagination was chosen because users need to navigate directly to "page 3 of 12". Cursor pagination doesn't support random access jumps. The salary explorer is a browsing experience, not an infinite scroll feed. Shareable URLs (`/salaries?page=3&level=L4`) are a feature, not an afterthought — they carry link equity. Trade-off acknowledged: page-based degrades at very deep pages (1000+). Not an issue at current scale.

### What I would build differently with another day

1. Full Typesense integration for fuzzy search with autocomplete — PostgreSQL ILIKE doesn't handle typos ("flipcart" won't match "flipkart")
2. ISR cache revalidation via Cloudflare Cache Purge API after `POST /api/ingest-salary` — currently a user must wait up to 300s to see their submitted salary
3. The salary heatmap on the homepage with a real India SVG map (`react-simple-maps`) — the data model supports it, the UI doesn't exist yet
4. `next-sitemap` integration — would auto-generate `sitemap.xml` from all company slugs and role pages, critical for the SEO flywheel

### What was NOT built (deliberate scope cuts under 72h)

- **Auth** — explicitly excluded per spec. No login walls, no sessions, no JWT.
- **Real job board** — page structure exists at `/jobs`; data is placeholder. Scraping pipeline would be a separate service.
- **Community forum real-time posting** — `/community` page structure is there; backend not wired. Would need WebSockets or polling + a separate posts model.
- **Full UK/US market pages** — INR/India-first. URL structure (`/salaries/{role}/{location}`) is ready to extend to other markets.
- **Sitemap.xml** — would be auto-generated via `next-sitemap` package. Skipped to keep scope clean.
- **Salary heatmap** — data model supports geo-level breakdowns; the SVG map UI was cut for time.
- **Python scraper pipeline** — architecture is documented in the trial spec. Not included in this repo; would be a separate service POSTing to `/api/ingest-salary`.

---

## Hardest Decision

The hardest call was the rendering strategy for `/companies/[slug]`. The temptation was ISR (simpler, handles all slugs) but `generateStaticParams` with a live DB query at build time is the right answer for the product: it means every company page is a pre-built HTML file served from Cloudflare's edge with zero runtime DB cost. The trade-off is that new companies added after a deploy won't get a static page until the next build — but with ISR fallback (`fallback: 'blocking'`), the first request generates the page and caches it. That first-request latency (a few hundred ms) is acceptable for a page that may never be visited again vs. paying DB query cost on every request for the thousands of pages that get heavy traffic.
