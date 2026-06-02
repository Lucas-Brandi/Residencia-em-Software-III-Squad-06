-- Remove coluna legada repository_id de analysis_rules.
-- O vínculo regra↔repositório agora é feito via rule_repositories (many-to-many).

-- Garante migração de dados legados antes de dropar a coluna
INSERT INTO "rule_repositories" ("id", "rule_id", "repository_id", "created_at")
SELECT
  gen_random_uuid()::text,
  ar.id,
  ar.repository_id,
  NOW()
FROM "analysis_rules" ar
WHERE ar.repository_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "rule_repositories" rr
    WHERE rr.rule_id = ar.id AND rr.repository_id = ar.repository_id
  );

-- Remove FK e coluna legada
ALTER TABLE "analysis_rules" DROP CONSTRAINT IF EXISTS "analysis_rules_repository_id_fkey";
ALTER TABLE "analysis_rules" DROP COLUMN IF EXISTS "repository_id";
