-- ================================================================
-- PATCH — Aplicar no Supabase SQL Editor
-- Adiciona: políticas INSERT públicas + tabela briefing_outputs
-- ================================================================

-- 1. Políticas INSERT públicas para o MVP (sem autenticação)
CREATE POLICY IF NOT EXISTS "public_insert_projects"
  ON imersao_projects FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "public_insert_members"
  ON imersao_members FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "public_insert_progress"
  ON imersao_progress FOR INSERT WITH CHECK (true);

-- 2. Tabela briefing_outputs (Prompt Optimizer → Supabase)
CREATE TABLE IF NOT EXISTS briefing_outputs (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_name     TEXT NOT NULL,
  pain_points      TEXT,
  features         TEXT[],
  target_audience  TEXT,
  experience_level TEXT,
  suggested_stack  JSONB,
  ui_vibe          TEXT,
  prd_text         TEXT,
  design_tokens    JSONB,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE briefing_outputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "public_read_briefings"
  ON briefing_outputs FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "public_insert_briefings"
  ON briefing_outputs FOR INSERT WITH CHECK (true);

-- ================================================================
-- FIM DO PATCH
-- ================================================================
