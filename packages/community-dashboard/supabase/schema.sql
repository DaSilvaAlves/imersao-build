-- ================================================================
-- COMUNIDADE IA-PT — Schema Supabase
-- Imersão IA Portugal
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------
-- MEMBERS — Alunos registados na Imersão
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS imersao_members (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  avatar_url    TEXT,
  city          TEXT,                              -- "Lisboa", "Porto", etc.
  experience    TEXT CHECK (experience IN ('iniciante', 'intermediário', 'avançado')),
  linkedin_url  TEXT,
  joined_at     TIMESTAMPTZ DEFAULT NOW(),
  imersao_num   INTEGER DEFAULT 1,               -- Nº da imersão (1, 2, 3...)
  is_mentor     BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- PROJECTS — Projetos publicados pelos alunos
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS imersao_projects (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id     UUID REFERENCES imersao_members(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,                   -- "Gestor de Oficina Pro"
  description   TEXT,
  pain_point    TEXT,                            -- A "dor" original
  github_url    TEXT,                            -- Repo GitHub
  deploy_url    TEXT,                            -- URL de produção (Vercel)
  screenshot_url TEXT,                           -- Screenshot do projeto
  tech_stack    TEXT[],                          -- ["React 19", "Supabase", "Vite"]
  ui_style      TEXT,                            -- "brutalist" | "minimal" | etc.
  status        TEXT DEFAULT 'building' CHECK (status IN ('building', 'deployed', 'live')),
  imersao_num   INTEGER DEFAULT 1,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- PROGRESS — Progresso de cada aluno no pipeline
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS imersao_progress (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id     UUID REFERENCES imersao_members(id) ON DELETE CASCADE,
  imersao_num   INTEGER DEFAULT 1,
  -- Pipeline checkpoints (cada tool completada = true)
  step_profiler    BOOLEAN DEFAULT FALSE,        -- Student Profiler concluído
  step_briefing    BOOLEAN DEFAULT FALSE,        -- Briefing Generator concluído
  step_starter     BOOLEAN DEFAULT FALSE,        -- Starter Builder concluído
  step_optimizer   BOOLEAN DEFAULT FALSE,        -- Prompt Optimizer concluído
  step_compiler    BOOLEAN DEFAULT FALSE,        -- AIOS Compiler concluído
  step_deployed    BOOLEAN DEFAULT FALSE,        -- Deploy no Vercel concluído
  -- Metadata
  started_at    TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,                    -- NULL até deploy concluído
  notes         TEXT,                            -- Notas do mentor
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, imersao_num)
);

-- ----------------------------------------------------------------
-- INDEXES para performance
-- ----------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_members_imersao ON imersao_members(imersao_num);
CREATE INDEX IF NOT EXISTS idx_projects_member ON imersao_projects(member_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON imersao_projects(status);
CREATE INDEX IF NOT EXISTS idx_progress_member ON imersao_progress(member_id);

-- ----------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ----------------------------------------------------------------
ALTER TABLE imersao_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE imersao_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE imersao_progress ENABLE ROW LEVEL SECURITY;

-- Public read (comunidade é aberta)
CREATE POLICY "public_read_members"
  ON imersao_members FOR SELECT USING (true);

CREATE POLICY "public_read_projects"
  ON imersao_projects FOR SELECT USING (true);

-- Progress: mentor vê tudo, aluno vê o seu
CREATE POLICY "mentor_read_all_progress"
  ON imersao_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM imersao_members m
      WHERE m.id = auth.uid()::uuid AND m.is_mentor = true
    )
  );

-- Insert/Update protegido pelo service_role (sem auth publica por agora)
-- Para MVP: usar service_role key no backend/serverless

-- ----------------------------------------------------------------
-- SEED DATA — Dados de demonstração
-- ----------------------------------------------------------------
INSERT INTO imersao_members (name, email, city, experience, imersao_num, is_mentor) VALUES
  ('Eurico Alves', 'mentor@imersaoiapt.com', 'Lisboa', 'avançado', 1, true),
  ('Ana Ferreira', 'ana@exemplo.pt', 'Porto', 'iniciante', 1, false),
  ('Carlos Mendes', 'carlos@exemplo.pt', 'Braga', 'intermediário', 1, false),
  ('Sofia Rodrigues', 'sofia@exemplo.pt', 'Lisboa', 'iniciante', 1, false),
  ('João Santos', 'joao@exemplo.pt', 'Setúbal', 'iniciante', 1, false)
ON CONFLICT (email) DO NOTHING;

-- ================================================================
-- END OF SCHEMA
-- ================================================================
