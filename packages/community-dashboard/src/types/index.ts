export interface Member {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  city: string | null;
  experience: 'iniciante' | 'intermediário' | 'avançado' | null;
  linkedin_url: string | null;
  joined_at: string;
  imersao_num: number;
  is_mentor: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  member_id: string;
  name: string;
  description: string | null;
  pain_point: string | null;
  github_url: string | null;
  deploy_url: string | null;
  screenshot_url: string | null;
  tech_stack: string[] | null;
  ui_style: string | null;
  status: 'building' | 'deployed' | 'live';
  imersao_num: number;
  created_at: string;
  // joined
  member?: Pick<Member, 'name' | 'avatar_url' | 'city'>;
}

export interface Progress {
  id: string;
  member_id: string;
  imersao_num: number;
  step_profiler: boolean;
  step_briefing: boolean;
  step_starter: boolean;
  step_optimizer: boolean;
  step_compiler: boolean;
  step_deployed: boolean;
  started_at: string | null;
  completed_at: string | null;
  notes: string | null;
  // joined
  member?: Pick<Member, 'name' | 'avatar_url' | 'city' | 'experience'>;
}

export type View = 'members' | 'projects' | 'mentor';
