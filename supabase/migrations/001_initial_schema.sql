-- ============================================================================
-- ByteBuildIT — Initial Database Schema Migration (Idempotent)
-- ============================================================================
-- This migration creates the full CMS schema for ByteBuildIT, a premium
-- software product studio website. It covers organisations, users (admin +
-- public-facing team), content (pages, projects, solutions, industries,
-- services), media, navigation, settings, leads CRM, audit logging,
-- and all junction tables.
--
-- Run with:  supabase db reset   or   psql -f 001_initial_schema.sql
-- ============================================================================

-- ── Extensions ──────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Helper: updated_at trigger ───────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Helper to attach the updated_at trigger to a table safely
CREATE OR REPLACE FUNCTION public.set_updated_at_trigger(table_name regclass)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON %s', table_name);
  EXECUTE format(
    'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %s
       FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()',
    table_name
  );
END;
$$;

-- ============================================================================
-- 1. ORGANIZATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.organizations (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          text NOT NULL,
  slug          text NOT NULL,
  logo_url      text,
  favicon_url   text,
  tagline       text,
  email         text,
  phone         text,
  whatsapp      text,
  address       text,
  social_links  jsonb DEFAULT '{}'::jsonb,
  business_hours jsonb DEFAULT '{}'::jsonb,
  copyright     text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations (slug);

SELECT public.set_updated_at_trigger('public.organizations');

-- ============================================================================
-- 2. DEPARTMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.departments (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id      uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name        text NOT NULL,
  slug        text NOT NULL,
  description text,
  ordering    int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_departments_org_slug ON public.departments (org_id, slug);
CREATE INDEX IF NOT EXISTS idx_departments_org_id ON public.departments (org_id);

-- ============================================================================
-- 3. TEAMS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.teams (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id      uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name        text NOT NULL,
  description text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teams_org_id ON public.teams (org_id);

-- ============================================================================
-- 4. ROLES  (admin roles for CMS users)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.roles (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        text NOT NULL UNIQUE,
  slug        text NOT NULL UNIQUE,
  description text,
  is_system   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. PERMISSIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.permissions (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        text NOT NULL UNIQUE,
  slug        text NOT NULL UNIQUE,
  description text,
  category    text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 6. ROLE_PERMISSIONS  (junction)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id       uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- ============================================================================
-- 7. USERS  (admin CMS users — linked to Supabase auth.users)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.users (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id          uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email           text NOT NULL UNIQUE,
  name            text NOT NULL,
  avatar_url      text,
  role_id         uuid NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
  department_id   uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  is_active       boolean NOT NULL DEFAULT true,
  last_login_at   timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_org_id ON public.users (org_id);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON public.users (role_id);

SELECT public.set_updated_at_trigger('public.users');

-- ============================================================================
-- 8. TEAM_MEMBERS  (public-facing team profiles)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.team_members (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id          uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name            text NOT NULL,
  slug            text NOT NULL,
  role            text,
  bio             text,
  photo_url       text,
  social_links    jsonb DEFAULT '{}'::jsonb,
  skills          text[] DEFAULT '{}',
  email           text,
  is_featured     boolean NOT NULL DEFAULT false,
  ordering        int NOT NULL DEFAULT 0,
  status          text NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'published', 'archived')),
  seo_title       text,
  seo_description text,
  seo_og_image    text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_team_members_org_slug ON public.team_members (org_id, slug);
CREATE INDEX IF NOT EXISTS idx_team_members_org_id ON public.team_members (org_id);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON public.team_members (status);

SELECT public.set_updated_at_trigger('public.team_members');

-- ============================================================================
-- 9. PAGES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.pages (
  id                    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id                uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title                 text NOT NULL,
  slug                  text NOT NULL,
  template              text DEFAULT 'default',
  status                text NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at          timestamptz,
  scheduled_at          timestamptz,
  seo_title             text,
  seo_description       text,
  seo_canonical         text,
  seo_robots            text DEFAULT 'index, follow',
  seo_og_title          text,
  seo_og_description    text,
  seo_og_image          text,
  seo_twitter_title     text,
  seo_twitter_description text,
  seo_schema_type       text DEFAULT 'WebPage',
  created_by            uuid REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by            uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_pages_org_slug ON public.pages (org_id, slug);
CREATE INDEX IF NOT EXISTS idx_pages_org_id ON public.pages (org_id);
CREATE INDEX IF NOT EXISTS idx_pages_status ON public.pages (status);

SELECT public.set_updated_at_trigger('public.pages');

-- ============================================================================
-- 10. PAGE_SECTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.page_sections (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id           uuid NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  block_type        varchar NOT NULL,
  title             text,
  content           jsonb DEFAULT '{}'::jsonb,
  settings          jsonb DEFAULT '{}'::jsonb,
  media             jsonb DEFAULT '{}'::jsonb,
  ordering          int NOT NULL DEFAULT 0,
  is_enabled        boolean NOT NULL DEFAULT true,
  visibility        text NOT NULL DEFAULT 'both'
                    CHECK (visibility IN ('desktop', 'both', 'mobile')),
  animation_preset  text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_sections_page_id ON public.page_sections (page_id);
CREATE INDEX IF NOT EXISTS idx_page_sections_ordering ON public.page_sections (page_id, ordering);

SELECT public.set_updated_at_trigger('public.page_sections');

-- ============================================================================
-- 11. PROJECTS  (case studies)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.projects (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id            uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title             text NOT NULL,
  slug              text NOT NULL,
  short_description text,
  full_description  text,
  problem           text,
  solution          text,
  outcomes          text,
  cover_image_url   text,
  client_name       text,
  client_logo_url   text,
  year              int,
  status            text NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  is_featured       boolean NOT NULL DEFAULT false,
  ordering          int NOT NULL DEFAULT 0,
  published_at      timestamptz,
  scheduled_at      timestamptz,
  seo_title         text,
  seo_description   text,
  seo_canonical     text,
  seo_robots        text DEFAULT 'index, follow',
  seo_og_title      text,
  seo_og_description text,
  seo_og_image      text,
  created_by        uuid REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by        uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_org_slug ON public.projects (org_id, slug);
CREATE INDEX IF NOT EXISTS idx_projects_org_id ON public.projects (org_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON public.projects (is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_ordering ON public.projects (ordering);

SELECT public.set_updated_at_trigger('public.projects');

-- ============================================================================
-- 12. SOLUTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.solutions (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id            uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title             text NOT NULL,
  slug              text NOT NULL,
  description       text,
  detailed_content  jsonb DEFAULT '{}'::jsonb,
  icon              text,
  visual_url        text,
  category          text NOT NULL
                    CHECK (category IN (
                      'business_systems', 'industry_software', 'automation',
                      'ai_intelligence', 'digital_products', 'infrastructure'
                    )),
  capabilities      text[] DEFAULT '{}',
  cta_text          text,
  cta_url           text,
  status            text NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'published', 'archived')),
  ordering          int NOT NULL DEFAULT 0,
  published_at      timestamptz,
  seo_title         text,
  seo_description   text,
  seo_og_image      text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_solutions_org_slug ON public.solutions (org_id, slug);
CREATE INDEX IF NOT EXISTS idx_solutions_org_id ON public.solutions (org_id);
CREATE INDEX IF NOT EXISTS idx_solutions_status ON public.solutions (status);
CREATE INDEX IF NOT EXISTS idx_solutions_category ON public.solutions (category);

SELECT public.set_updated_at_trigger('public.solutions');

-- ============================================================================
-- 13. INDUSTRIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.industries (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id              uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title               text NOT NULL,
  slug                text NOT NULL,
  overview            text,
  problems            text[] DEFAULT '{}',
  solutions           text[] DEFAULT '{}',
  featured_visual_url text,
  status              text NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft', 'published', 'archived')),
  ordering            int NOT NULL DEFAULT 0,
  seo_title           text,
  seo_description     text,
  seo_og_image        text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_industries_org_slug ON public.industries (org_id, slug);
CREATE INDEX IF NOT EXISTS idx_industries_org_id ON public.industries (org_id);
CREATE INDEX IF NOT EXISTS idx_industries_status ON public.industries (status);

SELECT public.set_updated_at_trigger('public.industries');

-- ============================================================================
-- 14. SERVICES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.services (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id      uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title       text NOT NULL,
  slug        text NOT NULL,
  description text,
  icon        text,
  category    text,
  status      text NOT NULL DEFAULT 'draft'
              CHECK (status IN ('draft', 'published', 'archived')),
  ordering    int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_services_org_slug ON public.services (org_id, slug);
CREATE INDEX IF NOT EXISTS idx_services_org_id ON public.services (org_id);
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services (status);

SELECT public.set_updated_at_trigger('public.services');

-- ============================================================================
-- 15. MEDIA
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.media (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id            uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  filename          text NOT NULL,
  original_filename text NOT NULL,
  mime_type         text NOT NULL,
  file_size         bigint NOT NULL,
  width             int,
  height            int,
  alt_text          text,
  caption           text,
  focal_point       jsonb,
  folder_path       text NOT NULL DEFAULT '/',
  url               text NOT NULL,
  thumbnail_url     text,
  uploaded_by       uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_org_id ON public.media (org_id);
CREATE INDEX IF NOT EXISTS idx_media_folder_path ON public.media (org_id, folder_path);
CREATE INDEX IF NOT EXISTS idx_media_mime_type ON public.media (mime_type);

-- ============================================================================
-- 16. NAVIGATION_ITEMS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.navigation_items (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id      uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  label       text NOT NULL,
  url         text NOT NULL,
  target      text NOT NULL DEFAULT '_self'
              CHECK (target IN ('_self', '_blank')),
  icon        text,
  parent_id   uuid REFERENCES public.navigation_items(id) ON DELETE CASCADE,
  nav_location text NOT NULL
               CHECK (nav_location IN ('primary', 'secondary', 'footer', 'cta')),
  ordering    int NOT NULL DEFAULT 0,
  is_visible  boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_navigation_items_org_id ON public.navigation_items (org_id);
CREATE INDEX IF NOT EXISTS idx_navigation_items_parent_id ON public.navigation_items (parent_id);
CREATE INDEX IF NOT EXISTS idx_navigation_items_location ON public.navigation_items (org_id, nav_location, ordering);

SELECT public.set_updated_at_trigger('public.navigation_items');

-- ============================================================================
-- 17. SETTINGS  (global / per-org key-value config)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.settings (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id      uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  key         text NOT NULL,
  value       jsonb DEFAULT 'null'::jsonb,
  category    text NOT NULL DEFAULT 'general'
              CHECK (category IN (
                'general', 'seo', 'analytics', 'contact',
                'social', 'appearance', 'maintenance'
              )),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_settings_org_key ON public.settings (org_id, key);
CREATE INDEX IF NOT EXISTS idx_settings_category ON public.settings (org_id, category);

SELECT public.set_updated_at_trigger('public.settings');

-- ============================================================================
-- 18. REDIRECTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.redirects (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id            uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  source_path       text NOT NULL,
  destination_path  text NOT NULL,
  status_code       int NOT NULL DEFAULT 301,
  is_active         boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_redirects_org_source ON public.redirects (org_id, source_path);
CREATE INDEX IF NOT EXISTS idx_redirects_org_id ON public.redirects (org_id);

-- ============================================================================
-- 19. LEADS  (CRM / contact form submissions)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.leads (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id            uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name              text NOT NULL,
  email             text NOT NULL,
  phone             text,
  company           text,
  problem_category  text,
  message           text,
  budget            text,
  timeline          text,
  source            text,
  landing_page      text,
  utm_source        text,
  utm_medium        text,
  utm_campaign      text,
  utm_term          text,
  utm_content       text,
  referrer          text,
  status            text NOT NULL DEFAULT 'new'
                    CHECK (status IN (
                      'new', 'contacted', 'qualified', 'proposal',
                      'won', 'lost', 'archived'
                    )),
  assigned_to       uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_org_id ON public.leads (org_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);

SELECT public.set_updated_at_trigger('public.leads');

-- ============================================================================
-- 20. LEAD_NOTES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lead_notes (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id     uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content     text NOT NULL,
  is_internal boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON public.lead_notes (lead_id);

-- ============================================================================
-- 21. LEAD_STATUS_HISTORY
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lead_status_history (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id     uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  from_status text,
  to_status   text NOT NULL,
  changed_by  uuid REFERENCES public.users(id) ON DELETE SET NULL,
  note        text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_status_history_lead_id ON public.lead_status_history (lead_id, created_at);

-- ============================================================================
-- 22. AUDIT_LOGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id      uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  actor_id    uuid REFERENCES public.users(id) ON DELETE SET NULL,
  action      text NOT NULL,
  entity_type text NOT NULL,
  entity_id   uuid,
  metadata    jsonb DEFAULT '{}'::jsonb,
  ip_address  inet,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id ON public.audit_logs (org_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs (entity_type, entity_id);

-- ============================================================================
-- 23. PROJECT_MEDIA  (junction)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.project_media (
  project_id  uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  media_id    uuid NOT NULL REFERENCES public.media(id) ON DELETE CASCADE,
  ordering    int NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  PRIMARY KEY (project_id, media_id)
);

CREATE INDEX IF NOT EXISTS idx_project_media_media_id ON public.project_media (media_id);

-- ============================================================================
-- 24. PROJECT_TECHNOLOGIES  (junction)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.project_technologies (
  project_id  uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  technology  varchar NOT NULL,
  PRIMARY KEY (project_id, technology)
);

-- ============================================================================
-- 25. PROJECT_INDUSTRIES  (junction)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.project_industries (
  project_id  uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  industry_id uuid NOT NULL REFERENCES public.industries(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, industry_id)
);

CREATE INDEX IF NOT EXISTS idx_project_industries_industry_id ON public.project_industries (industry_id);

-- ============================================================================
-- 26. PROJECT_SOLUTIONS  (junction)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.project_solutions (
  project_id  uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  solution_id uuid NOT NULL REFERENCES public.solutions(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, solution_id)
);

CREATE INDEX IF NOT EXISTS idx_project_solutions_solution_id ON public.project_solutions (solution_id);

-- ============================================================================
-- 27. PROJECT_RELATED  (junction — self-referencing)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.project_related (
  project_id        uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  related_project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, related_project_id),
  CHECK (project_id <> related_project_id)
);

-- ============================================================================
-- 28. SOLUTION_INDUSTRIES  (junction)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.solution_industries (
  solution_id uuid NOT NULL REFERENCES public.solutions(id) ON DELETE CASCADE,
  industry_id uuid NOT NULL REFERENCES public.industries(id) ON DELETE CASCADE,
  PRIMARY KEY (solution_id, industry_id)
);

CREATE INDEX IF NOT EXISTS idx_solution_industries_industry_id ON public.solution_industries (industry_id);
