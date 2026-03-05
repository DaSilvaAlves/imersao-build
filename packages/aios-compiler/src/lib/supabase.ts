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
    console.log('✅ Project saved to Supabase:', data?.id);
    return data?.id ?? null;
  } catch (err) {
    console.error('[Supabase] saveProject failed:', err);
    return null;
  }
};
