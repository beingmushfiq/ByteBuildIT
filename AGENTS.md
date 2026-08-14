<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# ByteBuildIT V2 — AI Coding Rules

## Project Identity

**ByteBuildIT** is a premium software product studio. The platform must communicate:
`PREMIUM · CORPORATE · EDITORIAL · CINEMATIC · TECHNICAL · PRECISE`

It must never feel: `GENERIC · AI-GENERATED · TEMPLATE-LIKE · CLUTTERED · GIMMICKY`

## Stack

| Layer       | Technology                              |
|-------------|----------------------------------------|
| Framework   | Next.js 16 (App Router)                |
| Styling     | Tailwind CSS v4 + Vanilla CSS (tokens) |
| Fonts       | Geist Sans + Geist Mono                |
| Animation   | GSAP 3 + `@gsap/react` (`useGSAP`)     |
| Database    | Supabase (PostgreSQL)                  |
| Deploy      | Vercel                                 |

## Architecture Rules

1. **Never** use `pages/` directory — App Router only.
2. **Never** add `"use client"` unless the component uses hooks, browser APIs, or GSAP.
3. Server Components are the default. Fetch data server-side where possible.
4. All client animation must use `useGSAP` with a `scope` ref — never raw `useEffect` for GSAP.
5. `ScrollTrigger` must always be registered: `gsap.registerPlugin(ScrollTrigger)`.
6. Never hard-code inline `style` colors — always use CSS custom properties from `globals.css`.

## Design System

All tokens live in `src/app/globals.css`. Never create new color values outside this file.

**Critical tokens:**
```
--color-dark        background dark surface
--color-accent      #2E4AF9 — the brand blue
--color-light       primary text
--color-muted       secondary text
--font-display      Geist Sans (headings)
--font-mono         Geist Mono (labels, metadata, UI)
--font-body         Geist Sans (body copy)
```

## Typography Rules

- Display headings: `font-size: clamp(...)`, `font-weight: 700`, `letter-spacing: -0.03em` to `-0.04em`
- Section labels: `font-family: var(--font-mono)`, `font-size: 10px`, `letter-spacing: 0.1em`, `text-transform: uppercase`
- Body copy: `line-height: 1.75`, `color: var(--color-muted)`
- Never use `font-size` in `px` for headings — always `clamp()` or CSS tokens

## Component Rules

- Use `data-` attributes for GSAP targets (e.g., `data-h-headline`, `data-proj-item`)
- Interactive elements must have `onMouseEnter/onMouseLeave` for hover states inline
- Custom cursor interaction: add `data-cursor-type="project"` to project card links
- All sections must have an `id` attribute matching its nav anchor

## Admin CMS Rules

- Admin routes: `/admin/*`
- Admin layout: collapsible sidebar with `--color-admin-*` CSS tokens
- Command palette available via `⌘K` — never block access to it
- Admin components do NOT go in `src/components/` — they live inside `src/app/admin/`

## File Naming

```
src/
  app/
    page.tsx              public home
    work/page.tsx         work archive
    work/[slug]/page.tsx  case study
    admin/layout.tsx      CMS shell
    admin/page.tsx        dashboard
    admin/*/page.tsx      CMS modules
    api/contact/route.ts  contact endpoint
  components/
    navigation/Navigation.tsx
    sections/*.tsx
    ui/Cursor.tsx
    ui/SmoothScroll.tsx
  app/globals.css         SINGLE source of truth for tokens
```

## Anti-Patterns (Never Do)

- ❌ `import styles from './Component.module.css'` — use globals.css tokens
- ❌ `className="bg-blue-500"` arbitrary Tailwind — use CSS variables
- ❌ `Math.random()` during render — causes hydration mismatch
- ❌ `gsap.to()` in `useEffect` — use `useGSAP()` instead
- ❌ Nesting `<button>` inside `<a>` or vice versa — invalid HTML
- ❌ `window` or `document` access outside `useEffect`/`useGSAP`
