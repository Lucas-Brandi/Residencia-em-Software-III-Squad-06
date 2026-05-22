-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('CRITICO', 'AVISO', 'INFO');

-- AlterTable
ALTER TABLE "analysis_rules" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "severity" "Severity" NOT NULL DEFAULT 'AVISO';
