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

// Typography pairings per style — Google Fonts with character (never Inter/Roboto/Arial)
const TYPOGRAPHY_MAP: Record<string, { display: string; body: string; headingTracking: string; titleEffect: string }> = {
  glass: {
    display: 'Orbitron or Rajdhani (import from Google Fonts — futuristic display)',
    body: 'Syne or DM Sans (import from Google Fonts — refined body)',
    headingTracking: 'letter-spacing: 0.12em to 0.2em on all headings',
    titleEffect: 'metallic gradient or cyan glow effect on main h1/h2 titles',
  },
  brutalist: {
    display: 'Space Grotesk Bold (import from Google Fonts — heavy, geometric)',
    body: 'IBM Plex Mono (import from Google Fonts — technical, precise)',
    headingTracking: 'letter-spacing: -0.02em on headings (tight, punchy)',
    titleEffect: 'all-caps with thick text-shadow offset (no glow)',
  },
  minimal: {
    display: 'Plus Jakarta Sans (import from Google Fonts — refined, modern)',
    body: 'Instrument Sans or Nunito Sans (import from Google Fonts — readable)',
    headingTracking: 'letter-spacing: 0.04em on headings',
    titleEffect: 'subtle color contrast using foreground at full opacity',
  },
  gastro: {
    display: 'Playfair Display (import from Google Fonts — editorial, warm)',
    body: 'Lato or Jost (import from Google Fonts — approachable)',
    headingTracking: 'letter-spacing: 0.06em on headings',
    titleEffect: 'warm text color using accent tone with slight italic on key headings',
  },
  bento: {
    display: 'Noto Sans Display (import from Google Fonts — neutral, versatile)',
    body: 'JetBrains Mono or Figtree (import from Google Fonts)',
    headingTracking: 'letter-spacing: 0.05em on headings',
    titleEffect: 'accent-colored number/label prefixes on section titles',
  },
};

// Animation blueprints per style
const ANIMATION_MAP: Record<string, string> = {
  glass: `- Entry: fade-in + translateY(-12px) on all major elements, staggered by 80ms (CSS animation-delay)
  - Hover buttons: "scan line" effect — pseudo-element sliding from left on hover, 0.3s
  - Cursor: custom cursor (8px dot + 24px ring that follows with 60ms lag) — CSS-only
  - Transitions: 0.3s ease on all interactive states (color, opacity, border, transform)
  - Optional: subtle glitch effect on h1 (keyframe with clip-path shifts, 4s interval, moderate)
  - Scrollbar: 4px wide, accent color thumb, transparent track`,
  brutalist: `- Entry: instant appear — no fade (brutalist = no softness)
  - Hover: hard color inversion (background ↔ foreground swap), 0s transition
  - Focus: thick 3px accent-color outline, offset 2px
  - Active state: translateY(2px) for pressed-down feel
  - No cursor customization, no scrollbar styling`,
  minimal: `- Entry: subtle fade-in (opacity 0→1, 0.4s ease) on sections, no translate
  - Hover: gentle opacity change (1→0.7) on links, 0.2s
  - Transitions: 0.2s ease-in-out on all interactive states
  - Focus: thin 1px accent outline with 4px offset
  - Scrollbar: thin 2px, light gray thumb`,
  gastro: `- Entry: fade-in + slight scale (0.97→1) on cards, 0.5s ease-out, staggered 100ms
  - Hover cards: translateY(-4px) + subtle box-shadow increase, 0.3s
  - Image hover: slight zoom (scale 1.03) on food images
  - Transitions: 0.3s ease on all states
  - Scrollbar: 6px, earthy accent color`,
  bento: `- Entry: cells appear in grid order (stagger by grid position, 60ms each), slide from bottom 8px
  - Hover cell: border accent highlight + subtle background tint, 0.2s
  - Active cell: scale(0.98) press feedback
  - Transitions: 0.2s ease on all states
  - Scrollbar: 4px, accent color`,
};

// CSS patterns / architecture per style
const CSS_PATTERNS_MAP: Record<string, string> = {
  glass: `- CSS custom properties (variables) for entire palette: --color-bg, --color-fg, --color-accent, --color-accent-secondary, --blur-amount, --border-glow
  - Background: deep dark base + subtle dot or grid texture using CSS radial-gradient or SVG pattern
  - Cards/sections: backdrop-filter: blur(12px) + background: rgba(255,255,255,0.04) + border: 1px solid rgba(accent, 0.15)
  - Glow effects: box-shadow with accent color at low opacity (0 0 16px rgba(accent, 0.3))
  - Decorative: thin angled divider lines using CSS clip-path or border-image
  - Comment every CSS section: /* === SECTION NAME === */`,
  brutalist: `- CSS custom properties for palette and spacing scale
  - No border-radius (border-radius: 0 everywhere) or max 2px
  - Thick borders: 2px-3px solid --color-fg or --color-accent
  - High contrast — no shadows, no gradients (except intentional)
  - Grid-based layout with visible structure
  - Comment every CSS section`,
  minimal: `- CSS custom properties for palette, spacing (--space-xs to --space-2xl), and typography scale
  - Generous whitespace — padding and margin as primary design element
  - Subtle borders: 1px solid rgba(fg, 0.1)
  - Soft shadows: box-shadow: 0 1px 4px rgba(0,0,0,0.06)
  - border-radius: 8px-12px for cards
  - Comment every CSS section`,
  gastro: `- CSS custom properties for earthy palette and organic spacing
  - Warm shadows: box-shadow with warm brown/amber tones
  - border-radius: 12px-20px for organic feel
  - Background textures: subtle warm gradient overlays
  - Image-first: aspect-ratio utilities, object-fit: cover on all food images
  - Comment every CSS section`,
  bento: `- CSS custom properties for palette and grid system (--grid-gap, --cell-min-width)
  - CSS Grid for bento layout: grid-template-areas with named zones
  - Uniform border-radius: 12px across all cells
  - Consistent border: 1px solid rgba(fg, 0.12) on all cells
  - Hover state: border color shifts to accent
  - Comment every CSS section`,
};

// Component styles per style
const COMPONENT_MAP: Record<string, string> = {
  glass: `- Buttons: outline style with luminous border (border: 1px solid var(--color-accent), color: var(--color-accent)) OR solid with accent gradient; border-radius max 4-6px; never excessive rounding
  - Inputs/forms: terminal/cyberpunk style — bottom border ONLY (border-bottom: 1px solid accent), transparent background, glow on focus (box-shadow: 0 2px 8px rgba(accent,0.4))
  - Icons: Lucide React (already in scaffold) — use thin stroke, size 16-20px
  - Badge/tag: small, accent border, mono font
  - Empty states: centered icon + descriptive text, subtle styling`,
  brutalist: `- Buttons: full solid fill, no border-radius, thick border, uppercase text
  - Inputs: thick 2px border all around, no border-radius, high contrast on focus
  - Icons: Lucide React, size 18-24px
  - Badge: square, high contrast, uppercase
  - Empty states: bold, direct text message`,
  minimal: `- Buttons: subtle fill with gentle hover, 8px border-radius, normal weight text
  - Inputs: 1px border, 8px border-radius, light focus ring
  - Icons: Lucide React, size 16px
  - Badge: pill shape, muted colors
  - Empty states: light icon + gentle descriptive text`,
  gastro: `- Buttons: warm accent fill, 12px border-radius, medium weight
  - Inputs: 1px warm border, 8px radius, warm focus glow
  - Icons: Lucide React, size 20px
  - Price display: large, prominent, warm accent color
  - Empty states: food-related icon + friendly message`,
  bento: `- Buttons: clean fill, 8px border-radius, consistent height
  - Inputs: grid-aligned, 8px radius, accent border on focus
  - Icons: Lucide React, size 16-18px
  - Cell headers: small caps label + accent line underneath
  - Empty states: centered within cell with dashed border`,
};

function buildDesignSection(tokens: DesignTokens | null, styleDesc: string, layoutDesc: string): string {
  const style = tokens?.style ?? 'glass';
  const bg = tokens?.colorScheme.background ?? '#0a0a0a';
  const fg = tokens?.colorScheme.foreground ?? '#ffffff';
  const accent = tokens?.colorScheme.accent ?? '#00F5FF';

  const typoMap = TYPOGRAPHY_MAP[style] ?? TYPOGRAPHY_MAP['glass'];
  const animations = ANIMATION_MAP[style] ?? ANIMATION_MAP['glass'];
  const cssPatterns = CSS_PATTERNS_MAP[style] ?? CSS_PATTERNS_MAP['glass'];
  const components = COMPONENT_MAP[style] ?? COMPONENT_MAP['glass'];

  const cssDirectivesLine = tokens?.cssDirectives
    ? `\nExtra CSS directives from design tokens: ${tokens.cssDirectives}`
    : '';

  return `Style: ${styleDesc}
Layout pattern: ${layoutDesc}

Colors:
  - background: "${bg}"
  - foreground: "${fg}"
  - accent: "${accent}"
  - Derive a complementary secondary accent from the accent color for depth (e.g. analogous hue at 60° offset)

Typography:
  - Display/headings: ${typoMap.display}
  - Body text: ${typoMap.body}
  - Heading tracking: ${typoMap.headingTracking}
  - Title effect: ${typoMap.titleEffect}
  - Never use Inter, Roboto, or Arial — the result must feel designed, not generic

Animations & micro-interactions:
  ${animations}

CSS architecture:
  ${cssPatterns}

Components:
  ${components}

Mobile-first responsive (base: mobile, breakpoint: 768px+)${cssDirectivesLine}`;
}

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
    : 'glassmorphism with frosted backgrounds, subtle gradients, and depth';
  const layoutDesc = tokens ? LAYOUT_DESCRIPTIONS[tokens.layout] ?? tokens.layout : 'grid';

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

    design: buildDesignSection(tokens, styleDesc, layoutDesc),

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
