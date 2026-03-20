import { createClient } from '@supabase/supabase-js';
import type { BriefingOutput, DesignTokens } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface BriefingRecord {
  project_name: string;
  pain_points: string;
  features: string[];
  target_audience: string;
  experience_level: string;
  suggested_stack: Record<string, string>;
  ui_vibe: string;
  prd_text: string;
  design_tokens: DesignTokens | null;
}

export const saveBriefingOutput = async (
  briefing: BriefingOutput,
  tokens: DesignTokens | null
): Promise<string | null> => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('briefing_outputs')
      .insert([{
        project_name:    briefing.projectName,
        pain_points:     briefing.painPoints,
        features:        briefing.features,
        target_audience: briefing.targetAudience,
        experience_level: briefing.experienceLevel,
        suggested_stack: briefing.suggestedStack,
        ui_vibe:         briefing.uiVibe,
        prd_text:        briefing.prdText,
        design_tokens:   tokens,
      }])
      .select('id')
      .single();
    if (error) { console.error('[Supabase] save briefing:', error.message); return null; }
    return data?.id ?? null;
  } catch (err) {
    console.error('[Supabase] saveBriefingOutput failed:', err);
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
