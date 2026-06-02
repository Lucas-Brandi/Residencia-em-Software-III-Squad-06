-- AlterTable
ALTER TABLE "repositories" ALTER COLUMN "team_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "repositories" ADD COLUMN "is_auto_registered" BOOLEAN NOT NULL DEFAULT false;
