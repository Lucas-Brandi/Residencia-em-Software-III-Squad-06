/*
  Warnings:

  - A unique constraint covering the columns `[repository_id,pr_number]` on the table `pull_requests` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "pull_requests" DROP CONSTRAINT "pull_requests_repository_id_fkey";

-- DropForeignKey
ALTER TABLE "team_users" DROP CONSTRAINT "team_users_team_id_fkey";

-- DropForeignKey
ALTER TABLE "team_users" DROP CONSTRAINT "team_users_user_id_fkey";

-- AlterTable
ALTER TABLE "pull_requests" ALTER COLUMN "author_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "pull_requests_repository_id_pr_number_key" ON "pull_requests"("repository_id", "pr_number");

-- AddForeignKey
ALTER TABLE "team_users" ADD CONSTRAINT "team_users_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_users" ADD CONSTRAINT "team_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pull_requests" ADD CONSTRAINT "pull_requests_repository_id_fkey" FOREIGN KEY ("repository_id") REFERENCES "repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
