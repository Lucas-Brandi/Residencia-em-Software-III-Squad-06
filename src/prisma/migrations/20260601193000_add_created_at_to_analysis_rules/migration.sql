-- AlterTable: analysis_rules.created_at estava no schema Prisma mas nunca foi criada no banco
ALTER TABLE "analysis_rules"
  ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
