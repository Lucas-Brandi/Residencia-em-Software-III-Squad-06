-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: add_findings_and_fix_rules_schema
--
-- O que esta migration resolve:
--   1. A tabela "findings" nunca foi criada — os findings da IA eram mockados.
--   2. A tabela "rule_repositories" (many-to-many entre regras e repos) também
--      estava ausente no banco; o schema.prisma já a define mas nenhuma
--      migration a criava.
--   3. Ajusta "analysis_rules" para remover a coluna legada "repository_id"
--      (substituída pela tabela intermediária) e adiciona as colunas que faltam
--      (title, description, updated_at).
--   4. Adiciona constraint CASCADE nas FKs de analysis_results e pull_requests
--      para consistência com o schema atual.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Corrige analysis_rules (adiciona colunas que faltam) ──────────────────

-- Adiciona "title" (obrigatório no schema, pode já existir em alguns ambientes)
ALTER TABLE "analysis_rules"
  ADD COLUMN IF NOT EXISTS "title"       TEXT,
  ADD COLUMN IF NOT EXISTS "description" TEXT,
  ADD COLUMN IF NOT EXISTS "updated_at"  TIMESTAMP(3);

-- Preenche title com o próprio content para linhas legadas (NOT NULL exige valor)
UPDATE "analysis_rules" SET "title" = LEFT("content", 100) WHERE "title" IS NULL;
UPDATE "analysis_rules" SET "updated_at" = NOW()           WHERE "updated_at" IS NULL;

-- Agora aplica NOT NULL
ALTER TABLE "analysis_rules"
  ALTER COLUMN "title"      SET NOT NULL,
  ALTER COLUMN "updated_at" SET NOT NULL;

-- ── 2. Cria tabela intermediária rule_repositories ────────────────────────────

CREATE TABLE IF NOT EXISTS "rule_repositories" (
  "id"            TEXT         NOT NULL,
  "rule_id"       TEXT         NOT NULL,
  "repository_id" TEXT         NOT NULL,
  "created_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "rule_repositories_pkey" PRIMARY KEY ("id")
);

-- Migra dados legados: se analysis_rules ainda tem repository_id, cria os vínculos
INSERT INTO "rule_repositories" ("id", "rule_id", "repository_id", "created_at")
SELECT
  gen_random_uuid()::text,
  ar.id,
  ar.repository_id,
  NOW()
FROM "analysis_rules" ar
WHERE ar.repository_id IS NOT NULL
  -- Evita duplicatas caso a migration rode mais de uma vez
  AND NOT EXISTS (
    SELECT 1 FROM "rule_repositories" rr
    WHERE rr.rule_id = ar.id AND rr.repository_id = ar.repository_id
  );

-- FKs da tabela intermediária
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'rule_repositories_rule_id_fkey'
  ) THEN
    ALTER TABLE "rule_repositories"
      ADD CONSTRAINT "rule_repositories_rule_id_fkey"
      FOREIGN KEY ("rule_id") REFERENCES "analysis_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'rule_repositories_repository_id_fkey'
  ) THEN
    ALTER TABLE "rule_repositories"
      ADD CONSTRAINT "rule_repositories_repository_id_fkey"
      FOREIGN KEY ("repository_id") REFERENCES "repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Unique constraint para evitar duplicatas
CREATE UNIQUE INDEX IF NOT EXISTS "rule_repositories_rule_id_repository_id_key"
  ON "rule_repositories"("rule_id", "repository_id");

-- ── 3. Cria tabela findings ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "findings" (
  "id"                 TEXT         NOT NULL,
  "analysis_result_id" TEXT         NOT NULL,
  "rule_id"            TEXT,
  "severity"           "Severity"   NOT NULL,
  "description"        TEXT         NOT NULL,
  "file_path"          TEXT,
  "line_number"        INTEGER,
  "created_at"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "findings_pkey" PRIMARY KEY ("id")
);

-- FK para analysis_results
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'findings_analysis_result_id_fkey'
  ) THEN
    ALTER TABLE "findings"
      ADD CONSTRAINT "findings_analysis_result_id_fkey"
      FOREIGN KEY ("analysis_result_id") REFERENCES "analysis_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  -- FK opcional para analysis_rules (rule_id pode ser null)
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'findings_rule_id_fkey'
  ) THEN
    ALTER TABLE "findings"
      ADD CONSTRAINT "findings_rule_id_fkey"
      FOREIGN KEY ("rule_id") REFERENCES "analysis_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- ── 4. Corrige FKs de pull_requests e analysis_results (CASCADE) ─────────────

-- pull_requests → repositories (CASCADE já adicionado por migration anterior,
--   mas garante para analysis_results → pull_requests)
DO $$
BEGIN
  -- Remove FK antiga sem CASCADE se existir
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'analysis_results_pr_id_fkey'
  ) THEN
    ALTER TABLE "analysis_results" DROP CONSTRAINT "analysis_results_pr_id_fkey";
  END IF;

  ALTER TABLE "analysis_results"
    ADD CONSTRAINT "analysis_results_pr_id_fkey"
    FOREIGN KEY ("pr_id") REFERENCES "pull_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
END $$;