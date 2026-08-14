@AGENTS.md

# ByteBuildIT V2 — Project Context for AI Assistants

## What this project is

ByteBuildIT is a software product studio that builds operational systems for businesses that have outgrown manual work. The website is the studio's primary commercial interface.

**Core tagline:** "We turn inefficient business processes into software."

## V2 Design Principles

This is a complete ground-up redesign. The design language is:

| Must be         | Must never be      |
|-----------------|--------------------|
| Premium         | Generic            |
| Editorial       | Template-like      |
| Cinematic       | Cluttered          |
| Corporate       | Childish           |
| Technical       | Gimmicky           |
| Precise         | Overdesigned       |

## Site Architecture

### Public Website
```
/                   Home (all sections)
/work               Project archive (editorial list)
/work/[slug]        Case study (premium editorial)
```

### Admin CMS (`/admin/*`)
```
/admin              Dashboard (greeting, stats, leads, projects)
/admin/projects     Project CMS (list + editor)
/admin/leads        Lead pipeline (kanban + detail)
/admin/media        Media library (visual browser)
/admin/users        RBAC user management
/admin/audit-log    System audit trail
/admin/settings     Categorized settings
```

## Sections — Home Page Order

1. **Hero** — Cinematic headline, CHAOS→ORDER scroll viz
2. **ComplexitySystem** — "Most businesses don't need more software"
3. **ProblemFinder** — Interactive 8-problem diagnostic
4. **Projects** — 3 featured projects, editorial gallery
5. **WhatWeBuild** — 6 category interactive selector
6. **ProductStudio** — 5-step pipeline viz
7. **About** — Approach stages + "We like difficult problems"
8. **Contact** — "What's wasting your time?" + GSAP slide panel

## Key Behavioral Rules for AI Assistants

1. **Never add visual noise** — no decorative SVGs, no gradient rainbow badges, no floating particles unless specified.
2. **Typography first** — hierarchy is created through type scale and weight, not just color.
3. **Animations must feel earned** — every animation should serve a communication purpose. No spin-for-the-sake-of-spin.
4. **Precision language** — copy is tight, declarative, no marketing fluff.
5. **Dark is the default** — all surfaces use `--color-dark` or `--color-primary`. Never white backgrounds on public pages.
6. **Mono for UI, Sans for content** — labels, metadata, badges → `--font-mono`. Body copy, headlines → `--font-display`/`--font-body`.

## Data Model (Supabase)

Key tables:
- `projects` — slug, title, subtitle, description, tags[], metrics jsonb, status, featured, published_at
- `leads` — name, email, company, problem, status (new/contacted/qualified/closed), source
- `media` — filename, url, type, alt, size_bytes
- `users` — id, email, role (admin/editor/viewer)

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Development Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # ESLint
```

## Seed Data

Run `supabase/seed.sql` in the Supabase SQL editor to populate mock projects, leads, and media assets for development.
