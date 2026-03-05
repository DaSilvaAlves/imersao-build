export interface BriefingOutput {
  projectName: string;
  painPoints: string;
  features: string[];
  targetAudience: string;
  experienceLevel: 'iniciante' | 'intermediário' | 'avançado';
  suggestedStack: {
    architecture: string;
    frontend: string;
    backend: string;
    database: string;
  };
  uiVibe: string;
  prdText: string;
  timestamp: string;
}

export interface DesignTokens {
  style: 'brutalist' | 'minimal' | 'glass' | 'gastro' | 'bento';
  layout: 'kanban' | 'list' | 'grid' | 'calendar';
  colorScheme: {
    background: string;
    foreground: string;
    accent: string;
  };
  typography: 'serif' | 'sans-serif' | 'mono';
  features: string[];
  cssDirectives: string;
}

export type BoostType = 'restaurant' | 'dashboard' | 'ecommerce' | 'none';

export interface DetectedBoost {
  type: BoostType;
  confidence: number; // 0-1
  triggeredBy: string[];
}

export interface PromptSections {
  role: string;
  context: string;
  target: string;
  architecture: string;
  language: string;
  features: string;
  design: string;
  files: string;
  rules: string;
  output: string;
}

export interface GeneratedPrompt {
  sections: PromptSections;
  fullText: string;
  detectedBoost: DetectedBoost;
  wordCount: number;
}

export type InputMode = 'manual' | 'pipeline';
export type PanelTab = 'input' | 'preview';

export type OptionalSkillId = 'skill-pwa-restaurant' | 'skill-ecommerce' | 'skill-portfolio';

export interface OptionalSkill {
  id: OptionalSkillId;
  label: string;
  emoji: string;
  description: string;
}

export const OPTIONAL_SKILLS: OptionalSkill[] = [
  {
    id: 'skill-pwa-restaurant',
    label: 'PWA Restaurant',
    emoji: '🍽️',
    description: 'Menu digital, reservas, carrinho WhatsApp, PWA instalável',
  },
  {
    id: 'skill-ecommerce',
    label: 'E-Commerce',
    emoji: '🛒',
    description: 'Catálogo, carrinho, checkout multi-step, gestão de stock',
  },
  {
    id: 'skill-portfolio',
    label: 'Portfolio',
    emoji: '🎨',
    description: 'Galeria de projetos, animações CSS, SEO, formulário de contacto',
  },
];
