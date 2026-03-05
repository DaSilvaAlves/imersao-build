import type {
  BriefingOutput,
  DesignTokens,
  BoostType,
  DetectedBoost,
  GeneratedPrompt,
  PromptSections,
  OptionalSkillId,
} from '../../types';

// Keywords map for automatic boost detection
const BOOST_KEYWORDS: Record<BoostType, string[]> = {
  restaurant: [
    'restaurante', 'menu', 'carta', 'ementa', 'refeição', 'prato',
    'cozinha', 'takeaway', 'delivery', 'reserva', 'mesa', 'comida',
    'café', 'pastelaria', 'bar',
  ],
  dashboard: [
    'dashboard', 'painel', 'análise', 'analítica', 'relatório', 'gráfico',
    'estatísticas', 'métricas', 'kpi', 'admin', 'backoffice', 'monitorização',
    'exportar', 'filtros',
  ],
  ecommerce: [
    'loja', 'e-commerce', 'ecommerce', 'vender', 'produto', 'carrinho',
    'comprar', 'pagamento', 'stock', 'encomenda', 'marketplace', 'preço',
    'desconto', 'promoção', 'catálogo',
  ],
  none: [],
};

const STYLE_DESCRIPTIONS: Record<string, string> = {
  brutalist: 'raw, bold, high-contrast brutalist with thick borders and stark typography',
  minimal: 'clean, whitespace-driven minimal with subtle borders and refined spacing',
  glass: 'glassmorphism with frosted backgrounds, subtle gradients, and depth',
  gastro: 'warm, food-focused neo-gastronomy with earthy tones and organic shapes',
  bento: 'japanese bento grid layout with modular, card-based components',
};

const LAYOUT_DESCRIPTIONS: Record<string, string> = {
  kanban: 'Kanban board (columns with drag-drop cards)',
  list: 'vertical list with rows and detail panels',
  grid: 'responsive grid of cards with hover effects',
  calendar: 'calendar grid with event overlays',
};

export function detectBoost(briefing: BriefingOutput): DetectedBoost {
  const searchText = [
    briefing.projectName,
    briefing.painPoints,
    briefing.uiVibe,
    ...(briefing.features || []),
  ]
    .join(' ')
    .toLowerCase();

  let best: BoostType = 'none';
  let bestScore = 0;
  let bestTriggers: string[] = [];

  for (const [type, keywords] of Object.entries(BOOST_KEYWORDS) as [BoostType, string[]][]) {
    if (type === 'none') continue;
    const triggered = keywords.filter(k => searchText.includes(k));
    const score = triggered.length / keywords.length;
    if (score > bestScore) {
      bestScore = score;
      best = type;
      bestTriggers = triggered;
    }
  }

  return {
    type: bestScore > 0.05 ? best : 'none',
    confidence: bestScore,
    triggeredBy: bestTriggers,
  };
}

function buildFilesSection(features: string[], projectName: string): string {
  const slug = projectName.toLowerCase().replace(/\s+/g, '-');
  const lines = ['Generate the following files:', `  - src/App.tsx`, `  - src/styles/theme.css`];
  features.forEach((_, i) => {
    const name = `feature-${i + 1}`;
    lines.push(`  - src/features/${name}/index.tsx`);
  });
  lines.push(`  - src/components/ui/Button.tsx`);
  lines.push(`  - src/types/index.ts`);
  lines.push(`  - src/main.tsx`);
  // suppress unused var
  void slug;
  return lines.join('\n');
}

const SKILL_ROLE_INJECTIONS: Record<OptionalSkillId, string> = {
  'skill-pwa-restaurant': `+ SKILL ACTIVE: PWA Restaurant
  - Progressive Web App (installable on mobile, works offline)
  - Mobile-first food & beverage UX patterns
  - WhatsApp/phone integration for orders and reservations
  - Touch-optimized with large tap targets (min 48px)`,
  'skill-ecommerce': `+ SKILL ACTIVE: E-Commerce
  - Product catalog with filtering, sorting, and search
  - Shopping cart with quantity management and persistence
  - Checkout flow with form validation
  - Stock management and availability indicators`,
  'skill-portfolio': `+ SKILL ACTIVE: Portfolio
  - Personal portfolio / freelancer presentation site
  - Gallery-first layout with project showcase
  - Smooth scroll animations (CSS-only, no GSAP)
  - SEO-optimized structure (semantic HTML, meta tags)`,
};

const SKILL_RULES_INJECTIONS: Record<OptionalSkillId, string> = {
  'skill-pwa-restaurant': `Restaurant rules: prices in EUR (€ X.XX), reservation max 3 steps, WhatsApp CTA via wa.me/ deeplink, image aspect ratio 4:3`,
  'skill-ecommerce': `E-Commerce rules: cart badge always visible, stock indicators (green >5, orange 1-5, red 0), never lose cart on navigation, order IDs format #ORD-YYYY-NNNN`,
  'skill-portfolio': `Portfolio rules: semantic HTML required (<header><main><section><footer>), CSS animations only (no JS libs), lazy loading for images, skip-to-content link`,
};

export function buildPrompt(
  briefing: BriefingOutput,
  tokens: DesignTokens | null,
  detectedBoost: DetectedBoost,
  activeSkills: Set<OptionalSkillId> = new Set()
): GeneratedPrompt {
  const styleDesc = tokens
    ? STYLE_DESCRIPTIONS[tokens.style] ?? tokens.style
    : 'modern, clean, professional';
  const layoutDesc = tokens ? LAYOUT_DESCRIPTIONS[tokens.layout] ?? tokens.layout : 'grid';
  const bg = tokens?.colorScheme.background ?? '#0a0a0a';
  const fg = tokens?.colorScheme.foreground ?? '#ffffff';
  const accent = tokens?.colorScheme.accent ?? '#EEFF00';
  const typo = tokens?.typography ?? 'sans-serif';

  const boostNote =
    detectedBoost.type !== 'none'
      ? `\n  + BOOST activated: ${detectedBoost.type.toUpperCase()} patterns (${detectedBoost.triggeredBy.slice(0, 3).join(', ')})`
      : '';

  const skillNotes = [...activeSkills]
    .map(id => `\n${SKILL_ROLE_INJECTIONS[id]}`)
    .join('');

  const skillRules = [...activeSkills]
    .map(id => `- ${SKILL_RULES_INJECTIONS[id]}`)
    .join('\n');

  const sections: PromptSections = {
    role: `You are a Senior Frontend Developer + UI Designer specialized in ${styleDesc}.
You produce complete, production-ready React 19 + TypeScript code with zero placeholders.${boostNote}${skillNotes}`,

    context: `Project: "${briefing.projectName}"
Problem to solve: "${briefing.painPoints}"
Builder experience level: ${briefing.experienceLevel}
UI Vibe: ${briefing.uiVibe}`,

    target: briefing.targetAudience,

    architecture: `Stack: ${briefing.suggestedStack.frontend} + ${briefing.suggestedStack.backend}
Database: ${briefing.suggestedStack.database}
Architecture: ${briefing.suggestedStack.architecture}
Layout pattern: ${layoutDesc}
State: React useState + Context (no external state library)
Persistence: LocalStorage (MVP)`,

    language: `- All code (variables, functions, comments, types): ENGLISH
- All UI strings (labels, buttons, text, placeholders, errors): Portuguese (PT-PT)
- Examples: const taskList = [] ✓  |  Button: "Guardar" ✓`,

    features: briefing.features
      .map((f, i) => `  - FR-${i + 1}: ${f}`)
      .join('\n'),

    design: `Style: ${styleDesc}
Colors: background="${bg}", foreground="${fg}", accent="${accent}"
Typography: ${typo}
${tokens?.cssDirectives ? `CSS Directives: ${tokens.cssDirectives}` : ''}
Mobile-first responsive (base: mobile, breakpoint: 768px+)`,

    files: buildFilesSection(briefing.features, briefing.projectName),

    rules: `- No external CSS libraries (no Tailwind, no Bootstrap)
- No external UI libraries beyond Lucide React
- No Lorem Ipsum or placeholder data — use realistic Portuguese examples
- Max 200 lines per file — split into smaller components if needed
- Every feature must be fully functional (no stubs, no TODO comments)
- Empty states for all lists
- Loading and error states for all async operations
- Accessible: aria-label on interactive elements, keyboard navigation
- No inline styles — use CSS custom properties in theme.css${skillRules ? `\n${skillRules}` : ''}`,

    output: `Output each file in a separate code block with filename as header.
Format: \`\`\`typescript src/App.tsx ... \`\`\`
Start with theme.css → types/index.ts → features → App.tsx → main.tsx
Include ALL files listed in [FILES].`,
  };

  const fullText = [
    `[ROLE]\n${sections.role}`,
    `[CONTEXT]\n${sections.context}`,
    `[TARGET]\n${sections.target}`,
    `[ARCHITECTURE]\n${sections.architecture}`,
    `[LANGUAGE]\n${sections.language}`,
    `[FEATURES]\n${sections.features}`,
    `[DESIGN]\n${sections.design}`,
    `[FILES]\n${sections.files}`,
    `[RULES]\n${sections.rules}`,
    `[OUTPUT]\n${sections.output}`,
  ].join('\n\n');

  return {
    sections,
    fullText,
    detectedBoost,
    wordCount: fullText.split(/\s+/).length,
  };
}
