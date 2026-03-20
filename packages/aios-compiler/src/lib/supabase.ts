import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface ProjectRecord {
  name: string;
  description?: string;
  github_url: string;
  tech_stack: string[];
  status: 'building' | 'deployed' | 'live';
  imersao_num: number;
}

export const saveProject = async (project: ProjectRecord): Promise<string | null> => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('imersao_projects')
      .insert([project])
      .select('id')
      .single();
    if (error) { console.error('[Supabase] save project:', error.message); return null; }
    console.log('Project saved to Supabase:', data?.id);
    return data?.id ?? null;
  } catch (err) {
    console.error('[Supabase] saveProject failed:', err);
    return null;
  }
};

// ── Pipeline Progress Persistence ──────────────────────────────────────────

export const updatePipelineProgress = async (
  email: string,
  step: number,
  data?: Record<string, unknown>
) => {
  if (!supabase) return null;
  try {
    const updatePayload: Record<string, unknown> = {
      student_email: email,
      current_step: step,
      [`step_${step}_completed`]: true,
      updated_at: new Date().toISOString(),
    };
    if (data) Object.assign(updatePayload, data);

    const { data: result, error } = await supabase
      .from('pipeline_progress')
      .upsert(updatePayload, { onConflict: 'student_email' })
      .select();

    if (error) {
      console.error('Pipeline progress update error:', error.message);
      return null;
    }
    return result?.[0] ?? null;
  } catch (err) {
    console.error('updatePipelineProgress failed:', err);
    return null;
  }
};

export const getPipelineProgress = async (email: string) => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('pipeline_progress')
      .select('*')
      .eq('student_email', email)
      .single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
};
