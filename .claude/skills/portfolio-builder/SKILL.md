---
name: portfolio-builder
description: "Especialista em portfólios profissionais com identidade visual única. Use para gerar arquitectura e prompt boost para portfólios pessoais dos alunos — freelancer, developer, designer."
triggers:
  - "@portfolio-builder"
  - "portfólio"
  - "site pessoal"
  - "freelancer"
  - "apresentação pessoal"
  - "portfolio"
license: MIT
metadata:
  author: orion (aios-master)
  version: "1.0.0"
  squad: project-type-specialists
---

# Portfolio Builder

Especialista em portfólios profissionais para a Imersão IA Portugal. Nunca genérico — cada portfólio deve ter personalidade visual única que fica na memória.

## Quando usar

- Portfólio pessoal (developer, designer, fotógrafo, etc.)
- Site de apresentação profissional
- Página de freelancer
- Qualquer site centrado em apresentar identidade e trabalho de uma pessoa

## Arquitectura de Ficheiros

```
src/sections/Hero/          # Hero full-screen com animação de texto
src/sections/About/         # Bio + skills como visual tags
src/sections/Work/          # Projectos com hover effects (3-6 items)
src/sections/Contact/       # Formulário ou link directo + redes sociais
src/components/ui/          # Navegação, botões, cards
src/styles/                 # Variáveis de tipografia e paleta escolhida
```

## Prompt Boost para Compiler

```
PORTFOLIO CONTEXT:
This is a personal portfolio website. Implement with strong aesthetic identity:

1. HERO: Full-screen with name, title/role, and a statement (not just a tagline).
   Animated text reveal on load. Cursor effect or subtle parallax.

2. ABOUT: Brief bio (2-3 paragraphs), skills as visual tags, photo placeholder.

3. WORK/PROJECTS (3-6 items):
   - Project card with title, description, tech stack tags, and links
   - Hover effect reveals more detail
   - Filter by category if multiple project types

4. CONTACT: Simple form (name, email, message) or direct email link.
   Social links as icon buttons.

5. TYPOGRAPHY: Choose ONE distinctive display font + ONE clean body font.
   Large, confident type in the hero. Generous line-height throughout.

6. ANIMATION: Smooth page-load sequence (staggered fade-in for sections).
   Subtle hover states on all interactive elements.

7. MINIMAL NAVIGATION: Name as logo + 3-4 nav links. No hamburger on desktop.

8. AESTHETIC: Commit to a clear direction. Options:
   - Brutalist: Raw, bold, typographic. Black/white + one accent.
   - Editorial: Magazine-like. Serif display, generous whitespace.
   - Dark & moody: Deep blacks, neon accents, glow effects.
   - Clean & confident: Light, lots of space, minimal color.
```

## Regras MVP

- Nunca genérico — personalidade visual única e memorável em cada portfólio
- Tipografia é a identidade: evitar Inter/Roboto/Arial — usar fontes com carácter
- 3 projectos excepcionais valem mais do que 10 projectos mediocres
- Commit a uma direcção estética — não misturar estilos
- O portfólio é a embalagem; o trabalho é o produto

---
*portfolio-builder — project-type-specialists squad*
