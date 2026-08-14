-- ============================================================================
-- ByteBuildIT V2 — Supabase Seed Data (Idempotent & Safe)
-- Run in Supabase SQL Editor: https://supabase.com/dashboard
-- ============================================================================

-- ── 1. Default Organization ──────────────────────────────────────────────────
INSERT INTO public.organizations (
  id, name, slug, tagline, email, phone, address, social_links, copyright
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'ByteBuildIT',
  'bytebuildit',
  'Business automation · Custom software · Intelligent systems',
  'hello@bytebuildit.com',
  '+880 1XXX-XXXXXX',
  'Dhaka, Bangladesh',
  '{"linkedin":"https://linkedin.com/company/bytebuildit","twitter":"https://twitter.com/bytebuildit","github":"https://github.com/bytebuildit"}'::jsonb,
  '© 2025 ByteBuildIT. All rights reserved.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  email = EXCLUDED.email;


-- ── 2. Projects ──────────────────────────────────────────────────────────────
INSERT INTO public.projects (
  id, org_id, title, slug, short_description, full_description,
  problem, solution, outcomes,
  client_name, year, status, is_featured, ordering, published_at
) VALUES
(
  '00000000-0000-0000-0000-000000000070',
  '00000000-0000-0000-0000-000000000001',
  'OrderShield',
  'ordershield',
  'Order Management System',
  'A unified order intelligence platform that replaced a 7-spreadsheet operation with real-time visibility, automated routing, and exception management.',
  'A mid-size e-commerce distributor was managing 1,200+ daily orders across 7 spreadsheets, shared between 14 staff. Orders were lost. Exceptions went unnoticed. Fulfillment depended entirely on institutional knowledge held by three people.',
  'We designed and built a centralized order management system with real-time routing, exception management, and a configurable approval workflow. The system integrates directly with the client warehouse management and shipping carriers.',
  'Within 90 days of launch, order processing time dropped 74%, the error rate fell 91%, and the three key-person dependencies were fully eliminated. The client operations team grew from 14 to 9 people and handled 40% more volume.',
  'Lagos Logistics',
  2024, 'published', true, 1, NOW()
),
(
  '00000000-0000-0000-0000-000000000071',
  '00000000-0000-0000-0000-000000000001',
  'StaffSync',
  'staffsync',
  'Field Operations Platform',
  'A mobile-first scheduling and dispatch platform for 200+ field staff across 12 sites, replacing manual rosters and WhatsApp coordination.',
  'A facilities management company with 200+ field staff across 12 sites was coordinating schedules via WhatsApp groups, paper timesheets, and a shared Google Sheet that no one fully trusted. No-shows were frequent, overtime was invisible, and invoicing was weeks behind.',
  'A mobile-first scheduling and dispatch platform with real-time attendance tracking, shift management, and automated timesheet generation. Built to work offline-first for staff in low-connectivity environments.',
  'No-shows dropped 83% within the first month. Coordinator time spent on scheduling fell 60%. Invoicing became weekly instead of monthly. The platform became the operational backbone of the business.',
  'MediStaff',
  2024, 'published', true, 2, NOW() - INTERVAL '30 days'
),
(
  '00000000-0000-0000-0000-000000000072',
  '00000000-0000-0000-0000-000000000001',
  'InvoiceFlow',
  'invoiceflow',
  'Accounts Receivable Automation',
  'An AI-powered accounts receivable system that processes, validates, and routes supplier invoices automatically — cutting a 5-day cycle to under 4 hours.',
  'A professional services firm was receiving 2,000+ supplier invoices per month via email. Each was manually opened, data-entered into the ERP, validated, and routed for approval. The process took 5 days average and had a 6% error rate causing payment delays and vendor disputes.',
  'An AI-powered document processing pipeline that extracts invoice data, validates against PO records, and routes for approval — with human review reserved only for exceptions and high-value invoices.',
  'Average processing time dropped from 5 days to under 4 hours. Manual review reduced by 78% — staff now focus on exceptions rather than data entry. Payment disputes fell significantly as accuracy improved.',
  'Atlas Finance',
  2023, 'published', true, 3, NOW() - INTERVAL '60 days'
),
(
  '00000000-0000-0000-0000-000000000073',
  '00000000-0000-0000-0000-000000000001',
  'RouteIQ',
  'routeiq',
  'Logistics Route Intelligence',
  'Dynamic route optimization for a regional logistics operator managing 120+ daily deliveries across 8 cities, cutting fuel spend and missed windows.',
  'A regional logistics company managing 120+ delivery trucks across 8 urban zones was experiencing heavy traffic delays, inaccurate ETAs, and high fuel burn from unoptimized routing.',
  'We engineered a real-time route optimization engine using dynamic traffic models, load constraints, and automated dispatch re-routing.',
  'Fuel consumption fell by 22% and missed delivery windows dropped by 68% in the first 6 months of deployment.',
  'Apex Fleet',
  2023, 'published', false, 4, NOW() - INTERVAL '90 days'
),
(
  '00000000-0000-0000-0000-000000000074',
  '00000000-0000-0000-0000-000000000001',
  'DataBridge',
  'databridge',
  'System Integration Platform',
  'A real-time data integration layer connecting five disparate business systems — eliminating the manual data transfer that consumed 20+ hours per week.',
  'Operations teams were manually downloading CSVs from 5 legacy platforms every morning to cross-reference customer orders and stock levels.',
  'A middleware integration platform with bi-directional syncing, event-driven webhooks, and idempotent error recovery queues.',
  'Eliminated 100% of manual data entry tasks and reduced data synchronization latency from 24 hours to sub-second.',
  'ClearHealth',
  2023, 'published', false, 5, NOW() - INTERVAL '120 days'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  problem = EXCLUDED.problem,
  solution = EXCLUDED.solution,
  outcomes = EXCLUDED.outcomes,
  client_name = EXCLUDED.client_name,
  year = EXCLUDED.year,
  status = EXCLUDED.status,
  is_featured = EXCLUDED.is_featured,
  ordering = EXCLUDED.ordering;


-- ── 3. Project Technologies ──────────────────────────────────────────────────
INSERT INTO public.project_technologies (project_id, technology) VALUES
  ('00000000-0000-0000-0000-000000000070', 'Next.js'),
  ('00000000-0000-0000-0000-000000000070', 'TypeScript'),
  ('00000000-0000-0000-0000-000000000070', 'Supabase'),
  ('00000000-0000-0000-0000-000000000070', 'PostgreSQL'),
  ('00000000-0000-0000-0000-000000000071', 'Next.js'),
  ('00000000-0000-0000-0000-000000000071', 'TypeScript'),
  ('00000000-0000-0000-0000-000000000071', 'Supabase'),
  ('00000000-0000-0000-0000-000000000071', 'PWA'),
  ('00000000-0000-0000-0000-000000000072', 'Python'),
  ('00000000-0000-0000-0000-000000000072', 'Next.js'),
  ('00000000-0000-0000-0000-000000000072', 'OpenAI'),
  ('00000000-0000-0000-0000-000000000072', 'Supabase'),
  ('00000000-0000-0000-0000-000000000073', 'Python'),
  ('00000000-0000-0000-0000-000000000073', 'Google Maps API'),
  ('00000000-0000-0000-0000-000000000073', 'PostgreSQL'),
  ('00000000-0000-0000-0000-000000000074', 'Node.js'),
  ('00000000-0000-0000-0000-000000000074', 'Redis'),
  ('00000000-0000-0000-0000-000000000074', 'PostgreSQL')
ON CONFLICT (project_id, technology) DO NOTHING;


-- ── 4. Leads ─────────────────────────────────────────────────────────────────
INSERT INTO public.leads (
  id, org_id, name, email, company, message, status, source, created_at
) VALUES
(
  '00000000-0000-0000-0000-000000000081',
  '00000000-0000-0000-0000-000000000001',
  'James Okonkwo', 'james@lagoslogistics.ng', 'Lagos Logistics',
  'We manage 200+ deliveries a day across 3 cities. Our routing is all manual — WhatsApp + spreadsheets. We need a proper system with driver tracking and exception alerts.',
  'new', 'website_contact',
  NOW() - INTERVAL '2 hours'
),
(
  '00000000-0000-0000-0000-000000000082',
  '00000000-0000-0000-0000-000000000001',
  'Sara Müller', 'sara.muller@muellerpartner.de', 'Müller & Partner',
  'Our accounts payable process is completely manual. We receive 500+ invoices a month by email and everything is entered by hand into SAP. We need automation.',
  'contacted', 'website_contact',
  NOW() - INTERVAL '5 hours'
),
(
  '00000000-0000-0000-0000-000000000083',
  '00000000-0000-0000-0000-000000000001',
  'David Chen', 'dchen@apexmanufacturing.com', 'Apex Manufacturing',
  'Production scheduling is still done in Excel. We have 3 assembly lines, 80 workers, and we lose significant output because of scheduling conflicts and no visibility.',
  'qualified', 'website_contact',
  NOW() - INTERVAL '8 hours'
),
(
  '00000000-0000-0000-0000-000000000084',
  '00000000-0000-0000-0000-000000000001',
  'Priya Nair', 'p.nair@clearhealth.in', 'ClearHealth',
  'Patient appointment booking is done by phone. We want a self-service portal integrated with doctor availability and automatic reminders.',
  'new', 'website_contact',
  NOW() - INTERVAL '1 day'
),
(
  '00000000-0000-0000-0000-000000000085',
  '00000000-0000-0000-0000-000000000001',
  'Marco Bianchi', 'marco@bianchiretail.it', 'Bianchi Retail',
  'We sell through 4 channels — our own shop, Amazon, Shopify, and B2B wholesale. Inventory is never in sync. We need a single source of truth.',
  'contacted', 'website_contact',
  NOW() - INTERVAL '1 day'
),
(
  '00000000-0000-0000-0000-000000000086',
  '00000000-0000-0000-0000-000000000001',
  'Aisha Kamara', 'aisha@goldcoastlaw.com', 'Goldcoast Legal',
  'Document review for our case management is entirely manual. We have 200+ cases, and tracking documents, deadlines, and status is a mess in Google Drive.',
  'new', 'referral',
  NOW() - INTERVAL '2 days'
),
(
  '00000000-0000-0000-0000-000000000087',
  '00000000-0000-0000-0000-000000000001',
  'Tom Reeves', 'treeves@reevescontracting.com', 'Reeves Contracting',
  'We need a system to manage job scheduling, time tracking, and invoicing for our 40-person construction crew. Currently using paper and a basic app that barely works.',
  'qualified', 'website_contact',
  NOW() - INTERVAL '3 days'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  company = EXCLUDED.company,
  message = EXCLUDED.message,
  status = EXCLUDED.status;


-- ── 5. Media ─────────────────────────────────────────────────────────────────
INSERT INTO public.media (
  id, org_id, filename, original_filename, mime_type, file_size, alt_text, url
) VALUES
(
  '00000000-0000-0000-0000-000000000091',
  '00000000-0000-0000-0000-000000000001',
  'ordershield-dashboard.png', 'ordershield-dashboard.png', 'image/png', 486200,
  'OrderShield dashboard overview', '/media/ordershield-dashboard.png'
),
(
  '00000000-0000-0000-0000-000000000092',
  '00000000-0000-0000-0000-000000000001',
  'staffsync-mobile.png', 'staffsync-mobile.png', 'image/png', 312000,
  'StaffSync mobile scheduling view', '/media/staffsync-mobile.png'
),
(
  '00000000-0000-0000-0000-000000000093',
  '00000000-0000-0000-0000-000000000001',
  'invoiceflow-pipeline.png', 'invoiceflow-pipeline.png', 'image/png', 224000,
  'InvoiceFlow AI processing pipeline', '/media/invoiceflow-pipeline.png'
),
(
  '00000000-0000-0000-0000-000000000094',
  '00000000-0000-0000-0000-000000000001',
  'bytebuildit-og.png', 'bytebuildit-og.png', 'image/png', 128000,
  'ByteBuildIT open graph image', '/media/bytebuildit-og.png'
)
ON CONFLICT (id) DO UPDATE SET
  filename = EXCLUDED.filename,
  alt_text = EXCLUDED.alt_text,
  url = EXCLUDED.url;
