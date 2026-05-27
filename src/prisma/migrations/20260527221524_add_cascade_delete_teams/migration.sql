-- DropForeignKey
ALTER TABLE "repositories" DROP CONSTRAINT "repositories_team_id_fkey";

-- AddForeignKey
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
