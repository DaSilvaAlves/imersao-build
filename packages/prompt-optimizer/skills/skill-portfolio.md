# SKILL: Portfolio
> **Versão:** 1.0 | **Tipo:** Skill Opcional (Toggle Manual)
> **Activação:** Manual via toggle na UI do Prompt Optimizer
> **Aplica-se a:** Portfólios pessoais, sites de freelancer, páginas de apresentação profissional

---

## Descrição

Skill especializada para portfólios e sites pessoais. Injeta padrões de galeria de projetos, animações suaves, SEO on-page e secções standard (Hero, Sobre, Projetos, Contacto). Ideal para freelancers e criativos.

---

## Injecções no Prompt

### Adicionado a [ROLE]
```
+ SKILL ACTIVE: Portfolio
  - Personal portfolio / freelancer presentation site
  - Gallery-first layout with project showcase
  - Smooth scroll animations (CSS-only, no GSAP)
  - SEO-optimized structure (semantic HTML, meta tags)
  - Contact form with email integration (mailto: or formspree)
```

### Adicionado a [ARCHITECTURE]
```
Portfolio patterns:
  - Single Page Application with smooth anchor navigation
  - Section-based layout: Hero → About → Projects → Skills → Contact
  - CSS scroll-behavior: smooth + Intersection Observer for reveal animations
  - No router needed (single page)
  - SEO: <meta> tags, Open Graph, structured data
```

### Adicionado a [FEATURES] (se não especificados pelo aluno)
```
Suggested features for portfolio projects:
  - HeroSection: name, tagline, CTA buttons (CV download, contact), photo
  - AboutSection: bio, skills grid with icons, timeline/experience
  - ProjectsGallery: filterable grid by category, project cards with overlay
  - ProjectModal: full details, tech stack tags, live URL + GitHub links
  - SkillsSection: categorized skills with visual level indicators
  - ContactSection: form with name/email/message, social links
  - DarkModeToggle: persist preference in localStorage
```

### Adicionado a [RULES]
```
Portfolio-specific rules:
  - Semantic HTML: <header>, <main>, <section>, <footer> — required for SEO
  - Each project card: title, short description, tech tags, image, links
  - Animations: CSS transitions/keyframes only (no JS animation libraries)
  - Performance: lazy loading for project images (loading="lazy")
  - Contact form: client-side validation before submit, success state
  - Accessibility: skip-to-content link, proper heading hierarchy (h1 → h2 → h3)
  - Mobile: hamburger menu on mobile, full nav on desktop
  - Sections must have matching nav anchor IDs
```

---

## Paleta de Cores Recomendada

| Estilo | Background | Foreground | Accent |
|--------|-----------|-----------|--------|
| Dark Minimal | `#0a0a0a` | `#f5f5f5` | `#6366f1` |
| Light Clean | `#fafafa` | `#111111` | `#6366f1` |
| Brutalista | `#ffffff` | `#000000` | `#EEFF00` |

---

## Ficheiros Extra a Gerar

```
- src/features/hero/HeroSection.tsx
- src/features/about/AboutSection.tsx
- src/features/projects/ProjectsGallery.tsx
- src/features/projects/ProjectModal.tsx
- src/features/contact/ContactSection.tsx
- src/components/ui/NavBar.tsx
- public/index.html (com meta tags SEO)
```

---

## SEO Tags a Incluir em index.html

```html
<meta name="description" content="{{PROJECT_NAME}} — {{PAIN_POINTS}}">
<meta property="og:title" content="{{PROJECT_NAME}}">
<meta property="og:description" content="{{PAIN_POINTS}}">
<meta property="og:type" content="website">
<link rel="canonical" href="https://{{slug}}.vercel.app">
```

---

## Modelo de Dados Sugerido

```typescript
interface Project {
  id: string;
  title: string;           // "App de Gestão de Clientes"
  description: string;     // "Sistema completo para..."
  category: string;        // "Web App" | "Mobile" | "Design"
  techStack: string[];     // ["React", "Supabase", "TypeScript"]
  imageUrl?: string;
  liveUrl?: string;        // URL em produção
  githubUrl?: string;      // Repositório GitHub
  featured: boolean;       // Aparece em destaque
}

interface Skill {
  name: string;            // "React"
  category: string;        // "Frontend" | "Backend" | "Design"
  level: 1 | 2 | 3 | 4 | 5; // 1=básico, 5=expert
}
```

---

*SKILL Portfolio v1.0 — Imersão IA Portugal | Gerado por AIOS Master (Orion)*
