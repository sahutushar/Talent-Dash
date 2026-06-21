-- CreateEnum
CREATE TYPE "Level" AS ENUM ('L3', 'L4', 'L5', 'L6', 'SDE_I', 'SDE_II', 'SDE_III', 'STAFF', 'PRINCIPAL', 'IC4', 'IC5');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('INR', 'USD', 'GBP', 'EUR');

-- CreateEnum
CREATE TYPE "SalarySource" AS ENUM ('CONTRIBUTOR', 'SCRAPED', 'AI_INFERRED');

-- CreateEnum
CREATE TYPE "InterviewDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'VERY_HARD');

-- CreateEnum
CREATE TYPE "InterviewOutcome" AS ENUM ('OFFER', 'REJECT', 'GHOSTED', 'WITHDREW');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "normalized_name" TEXT NOT NULL,
    "industry" TEXT,
    "headquarters" TEXT,
    "founded_year" INTEGER,
    "headcount_range" TEXT,
    "logo_url" TEXT,
    "website" TEXT,
    "funding_stage" TEXT,
    "description" TEXT,
    "glassdoor_rating" DECIMAL(3,1),
    "ambitionbox_rating" DECIMAL(3,1),
    "talentdash_score" DECIMAL(4,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Salary" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "location" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "experience_years" INTEGER NOT NULL,
    "base_salary" BIGINT NOT NULL,
    "bonus" BIGINT NOT NULL DEFAULT 0,
    "stock" BIGINT NOT NULL DEFAULT 0,
    "total_compensation" BIGINT NOT NULL,
    "source" "SalarySource" NOT NULL,
    "confidence_score" DECIMAL(3,2) NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "role" TEXT,
    "level" "Level",
    "location" TEXT,
    "rating_overall" DECIMAL(2,1) NOT NULL,
    "rating_wlb" DECIMAL(2,1),
    "rating_growth" DECIMAL(2,1),
    "rating_mgmt" DECIMAL(2,1),
    "rating_culture" DECIMAL(2,1),
    "rating_compensation" DECIMAL(2,1),
    "title" TEXT NOT NULL,
    "pros" TEXT,
    "cons" TEXT,
    "would_recommend" BOOLEAN NOT NULL DEFAULT true,
    "is_anonymous" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "level" "Level",
    "location" TEXT,
    "difficulty" "InterviewDifficulty" NOT NULL,
    "outcome" "InterviewOutcome" NOT NULL,
    "rounds" JSONB,
    "tips" TEXT,
    "years_experience" INTEGER,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkplaceScore" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "score_compensation" DECIMAL(4,2) NOT NULL,
    "score_wlb" DECIMAL(4,2) NOT NULL,
    "score_growth" DECIMAL(4,2) NOT NULL,
    "score_culture" DECIMAL(4,2) NOT NULL,
    "score_dei" DECIMAL(4,2) NOT NULL,
    "score_remote" DECIMAL(4,2) NOT NULL,
    "composite_score" DECIMAL(4,2) NOT NULL,
    "computed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkplaceScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");

-- CreateIndex
CREATE INDEX "Company_normalized_name_idx" ON "Company"("normalized_name");

-- CreateIndex
CREATE INDEX "Company_industry_idx" ON "Company"("industry");

-- CreateIndex
CREATE INDEX "Salary_company_id_level_location_idx" ON "Salary"("company_id", "level", "location");

-- CreateIndex
CREATE INDEX "Salary_total_compensation_idx" ON "Salary"("total_compensation");

-- CreateIndex
CREATE INDEX "Salary_submitted_at_idx" ON "Salary"("submitted_at");

-- CreateIndex
CREATE INDEX "Salary_location_level_idx" ON "Salary"("location", "level");

-- CreateIndex
CREATE INDEX "Salary_role_idx" ON "Salary"("role");

-- CreateIndex
CREATE INDEX "Review_company_id_idx" ON "Review"("company_id");

-- CreateIndex
CREATE INDEX "Review_submitted_at_idx" ON "Review"("submitted_at");

-- CreateIndex
CREATE INDEX "Interview_company_id_idx" ON "Interview"("company_id");

-- CreateIndex
CREATE INDEX "Interview_role_idx" ON "Interview"("role");

-- CreateIndex
CREATE UNIQUE INDEX "WorkplaceScore_company_id_key" ON "WorkplaceScore"("company_id");

-- CreateIndex
CREATE INDEX "WorkplaceScore_composite_score_idx" ON "WorkplaceScore"("composite_score");

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkplaceScore" ADD CONSTRAINT "WorkplaceScore_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
