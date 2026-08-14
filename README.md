<div align="center">

<img src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dark%20navy%20blue%20abstract%20geometric%20technology%20logo%20mark%20minimalist%20premium%20software%20company%20branding%20clean%20lines%20on%20pure%20black%20background%20high%20end%20corporate%20identity&image_size=square_hd" width="120" style="border-radius: 20px; margin-bottom: 24px;" />

<br />

# BYTEBUILDIT

**We turn inefficient business processes into software.**

<br />

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FC1C9?style=for-the-badge&logo=supabase&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?style=for-the-badge&logo=greensock&logoColor=white)

<br />

Premium software product studio — business automation, custom software, intelligent systems.

<br />

</div>

---

## Overview

ByteBuildIT is a premium digital platform that identifies inefficient business processes and transforms them into software systems, automation, intelligent workflows, operational platforms, digital products, and scalable SaaS.

This repository contains the **complete public website and CMS** — designed from the ground up to feel like a premium software product launch, not a template.

**Public Website** — Cinematic editorial experience with GSAP-powered scroll animations, custom cursor system, and immersive project showcases.

**CMS / Admin** — A premium internal tool inspired by the precision of Linear, Notion, and Vercel — featuring a visual page builder, lead pipeline CRM, media library, SEO manager, and full RBAC.

---

## Architecture

```
bytebuildit/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # Public-facing pages
│   │   │   ├── work/           # Project gallery & detail
│   │   │   ├── solutions/      # Solutions categories
│   │   │   ├── industries/     # Industry pages
│   │   │   ├── about/          # About page
│   │   │   └── contact/        # Contact experience
│   │   ├── admin/              # CMS / Admin dashboard
│   │   │   ├── projects/       # Project management
│   │   │   ├── leads/          # Lead pipeline CRM
│   │   │   ├── media/          # Media library
│   │   │   ├── navigation/     # Navigation editor
│   │   │   ├── seo/            # SEO manager
│   │   │   ├── settings/       # Site settings
│   │   │   ├── users/          # Team & RBAC
│   │   │   └── audit-log/      # System audit trail
│   │   └── api/                # REST API routes
│   ├── components/
│   │   ├── sections/           # Public page sections
│   │   ├── navigation/         # Header & mobile nav
│   │   └── ui/                 # Shared UI primitives
│   └── lib/
│       ├── api/                # Data fetching layer
│       ├── auth/               # Auth, RBAC & audit
│       ├── supabase/           # Supabase client config
│       ├── seo/                # SEO utilities
│       ├── security/           # Security helpers
│       └── validation/         # Input validation
└── supabase/
    └── migrations/             # Database schema
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **UI** | React 19 |
| **Styling** | Tailwind CSS 4 |
| **Animation** | GSAP 3 + ScrollTrigger |
| **Smooth Scroll** | Lenis |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth + RBAC |
| **Typography** | Space Grotesk · Inter · JetBrains Mono |

---

## Design System

The visual language is built on **Precision + Contrast + Depth + Motion + Typography**.

| Token | Value |
|-------|-------|
| Primary Navy | `#000F26` |
| Accent Blue | `#2E4AF9` |
| Dark | `#05080F` |
| Deep Surface | `#0B1220` |
| Light | `#F7F8FA` |
| Muted | `#858D9A` |
| Border | `rgba(255,255,255,0.10)` |

**Typography Scale:** Display 120px+ · Hero 72–110px · Section 48–72px · Subheading 24–32px · Body 16–20px · Metadata 12–14px

**Grid:** 12-column desktop · 8-column tablet · 4-column mobile

**Radius:** 4px · 6px · 8px · 12px · 16px (intentional, never excessive)

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **Supabase** project (or local instance via `supabase` CLI)

### Installation

```bash
# Clone the repository
git clone https://github.com/beingmushfiq/ByteBuildIT.git
cd bytebuildit

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Database

```bash
# Reset and seed the database
supabase db reset

# Or run migrations manually
psql -f supabase/migrations/001_initial_schema.sql
psql -f supabase/migrations/002_seed_data.sql
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Key Features

### Public Website

- **Cinematic Hero** — GSAP-powered fragment-to-system animation with ScrollTrigger
- **Custom Cursor** — Precision dot with intelligent expansion and magnetic nav
- **Scroll Choreography** — Editorial scroll sequences with clip-path, masking, and transforms
- **Problem Finder** — Interactive diagnostic interface with animated transformations
- **Project Gallery** — Editorial case-study layouts with shared-element transitions
- **Solutions Selector** — Category-driven interactive interface
- **Product Studio Pipeline** — Animated Problem → System → Pattern → Product → SaaS flow
- **Full-Screen Mobile Nav** — GSAP-staggered navigation with reduced-motion support

### CMS / Admin

- **Dashboard** — Contextual overview with inquiries, drafts, and activity
- **Command Center** — `⌘K` / `Ctrl+K` search across all content and actions
- **Page Builder** — Visual drag/drop block editor with live preview
- **Project Editor** — Two-column editorial layout with side panel metadata
- **Lead Pipeline** — Inbox · Pipeline · Table views with drag-and-drop stages
- **Media Library** — Visual browser with type filters and metadata editing
- **SEO Manager** — Live search-preview interface with structured data
- **Navigation Editor** — Drag-reorder with nested items and visibility control
- **RBAC** — Role-based permissions across Content, Projects, Leads, Media, SEO, Users
- **Audit Log** — Full system activity trail

### Engineering

- **Semantic HTML** — Accessible by default
- **Reduced Motion** — Respects `prefers-reduced-motion`
- **Responsive** — Designed for 4K → mobile with distinct compositions per breakpoint
- **Dark / Light CMS** — Polished dual-mode interface
- **Code Splitting** — Dynamic imports and lazy loading throughout
- **GPU Transforms** — Hardware-accelerated animations

---

## Database Schema

The Supabase schema covers:

- **Organizations** — Multi-tenant workspace foundation
- **Users & Roles** — Auth, departments, RBAC permissions
- **Content** — Pages, projects, solutions, industries, articles, team
- **Media** — Uploads with metadata, focal points, alt text
- **Navigation** — Hierarchical menu structures
- **Leads** — Full CRM pipeline with stages, notes, assignments
- **Settings** — Site config, SEO, analytics, integrations
- **Audit Log** — Complete activity tracking

---

## Responsive Breakpoints

| Device | Width |
|--------|-------|
| 4K | 3840px |
| Ultrawide | 2560px |
| Desktop | 1920px / 1440px / 1280px |
| Tablet | 1024px / 768px |
| Mobile | 430px / 390px / 360px |

---

## License

Proprietary — ByteBuildIT. All rights reserved.

---

<div align="center">

**bytebuildit.com**

*These people could build the software behind my business.*

</div>
