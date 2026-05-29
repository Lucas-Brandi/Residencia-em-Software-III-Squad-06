/*
  Warnings:

  - You are about to drop the column `repository_id` on the `analysis_rules` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `analysis_rules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "analysis_rules" DROP CONSTRAINT "analysis_rules_repository_id_fkey";

-- AlterTable
ALTER TABLE "analysis_rules" DROP COLUMN "repository_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "rule_repositories" (
    "id" TEXT NOT NULL,
    "rule_id" TEXT NOT NULL,
    "repository_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rule_repositories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rule_repositories_rule_id_repository_id_key" ON "rule_repositories"("rule_id", "repository_id");

-- AddForeignKey
ALTER TABLE "rule_repositories" ADD CONSTRAINT "rule_repositories_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "analysis_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rule_repositories" ADD CONSTRAINT "rule_repositories_repository_id_fkey" FOREIGN KEY ("repository_id") REFERENCES "repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
