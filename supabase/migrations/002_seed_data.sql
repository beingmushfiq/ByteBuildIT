-- ============================================================================
-- ByteBuildIT — Seed Data Migration
-- ============================================================================
-- Populates the CMS database with realistic demo content for ByteBuildIT,
-- a premium software product studio based in Dhaka, Bangladesh.
--
-- This migration is idempotent — all INSERTs use ON CONFLICT DO NOTHING
-- so it can be safely re-run.
--
-- Run with:  supabase db reset   or   psql -f 002_seed_data.sql
-- ============================================================================

-- ── Fixed UUIDs for deterministic seed data ─────────────────────────────────
-- Organization
--   00000000-0000-0000-0000-000000000001  ByteBuildIT
--
-- Admin CMS user (must match an auth.users row created separately)
--   00000000-0000-0000-0000-000000000001
--
-- Roles:         00000000-0000-0000-0000-000000000010 – 00000000-0000-0000-0000-000000000016
-- Permissions:   00000000-0000-0000-0000-000000000020 – 00000000-0000-0000-0000-000000000044
-- Departments:   00000000-0000-0000-0000-000000000050 – 00000000-0000-0000-0000-000000000055
-- Team members:  00000000-0000-0000-0000-000000000060 – 00000000-0000-0000-0000-000000000062
-- Projects:      00000000-0000-0000-0000-000000000070 – 00000000-0000-0000-0000-000000000077
-- Industries:    00000000-0000-0000-0000-000000000080 – 00000000-0000-0000-0000-000000000087
-- Solutions:     00000000-0000-0000-0000-000000000090 – 00000000-0000-0000-0000-000000000095
-- Navigation:    00000000-0000-0000-0000-0000000000A0 – 00000000-0000-0000-0000-0000000000A9
-- Settings:      00000000-0000-0000-0000-0000000000B0 – 00000000-0000-0000-0000-0000000000B7


-- ============================================================================
-- 1. ORGANIZATION
-- ============================================================================

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
  '© 2024 ByteBuildIT. All rights reserved.'
)
ON CONFLICT (slug) DO NOTHING;


-- ============================================================================
-- 2. ROLES
-- ============================================================================

INSERT INTO public.roles (id, name, slug, description, is_system) VALUES
  ('00000000-0000-0000-0000-000000000010', 'Super Admin',      'super-admin',      'Full system access with all permissions.',                true),
  ('00000000-0000-0000-0000-000000000011', 'Admin',            'admin',            'Administrative access to most CMS features.',              true),
  ('00000000-0000-0000-0000-000000000012', 'Editor',           'editor',           'Can create, edit, and publish content.',                   true),
  ('00000000-0000-0000-0000-000000000013', 'Content Manager',  'content-manager',  'Manages content across pages, projects, and solutions.',    true),
  ('00000000-0000-0000-0000-000000000014', 'Marketing',        'marketing',        'Access to marketing-relevant content and leads.',           true),
  ('00000000-0000-0000-0000-000000000015', 'Sales',            'sales',            'Access to leads, projects, and client-facing content.',     true),
  ('00000000-0000-0000-0000-000000000016', 'Viewer',           'viewer',           'Read-only access to the CMS.',                              true)
ON CONFLICT (slug) DO NOTHING;


-- ============================================================================
-- 3. PERMISSIONS
-- ============================================================================

INSERT INTO public.permissions (id, name, slug, description, category) VALUES
  -- Pages
  ('00000000-0000-0000-0000-000000000020', 'Create Pages',      'pages.create',      'Create new pages.',               'pages'),
  ('00000000-0000-0000-0000-000000000021', 'View Pages',        'pages.read',        'View pages and page content.',    'pages'),
  ('00000000-0000-0000-0000-000000000022', 'Update Pages',      'pages.update',      'Edit existing pages.',            'pages'),
  ('00000000-0000-0000-0000-000000000023', 'Delete Pages',      'pages.delete',      'Delete pages.',                   'pages'),
  ('00000000-0000-0000-0000-000000000024', 'Publish Pages',     'pages.publish',     'Publish or unpublish pages.',     'pages'),

  -- Projects
  ('00000000-0000-0000-0000-000000000025', 'Create Projects',   'projects.create',   'Create new projects.',            'projects'),
  ('00000000-0000-0000-0000-000000000026', 'View Projects',     'projects.read',     'View projects and case studies.', 'projects'),
  ('00000000-0000-0000-0000-000000000027', 'Update Projects',   'projects.update',   'Edit existing projects.',         'projects'),
  ('00000000-0000-0000-0000-000000000028', 'Delete Projects',   'projects.delete',   'Delete projects.',                'projects'),
  ('00000000-0000-0000-0000-000000000029', 'Publish Projects',  'projects.publish',  'Publish or unpublish projects.',  'projects'),

  -- Solutions
  ('00000000-0000-0000-0000-00000000002A', 'Create Solutions',  'solutions.create',  'Create new solutions.',           'solutions'),
  ('00000000-0000-0000-0000-00000000002B', 'View Solutions',    'solutions.read',    'View solutions.',                 'solutions'),
  ('00000000-0000-0000-0000-00000000002C', 'Update Solutions',  'solutions.update',  'Edit existing solutions.',        'solutions'),
  ('00000000-0000-0000-0000-00000000002D', 'Delete Solutions',  'solutions.delete',  'Delete solutions.',               'solutions'),

  -- Industries
  ('00000000-0000-0000-0000-00000000002E', 'Create Industries', 'industries.create', 'Create new industry pages.',      'industries'),
  ('00000000-0000-0000-0000-00000000002F', 'View Industries',   'industries.read',   'View industry pages.',            'industries'),
  ('00000000-0000-0000-0000-000000000030', 'Update Industries', 'industries.update', 'Edit existing industry pages.',   'industries'),
  ('00000000-0000-0000-0000-000000000031', 'Delete Industries', 'industries.delete', 'Delete industry pages.',          'industries'),

  -- Media
  ('00000000-0000-0000-0000-000000000032', 'Upload Media',      'media.create',      'Upload new media files.',         'media'),
  ('00000000-0000-0000-0000-000000000033', 'View Media',        'media.read',        'View the media library.',         'media'),
  ('00000000-0000-0000-0000-000000000034', 'Update Media',      'media.update',      'Edit media metadata.',            'media'),
  ('00000000-0000-0000-0000-000000000035', 'Delete Media',      'media.delete',      'Delete media files.',             'media'),

  -- Users
  ('00000000-0000-0000-0000-000000000036', 'Create Users',      'users.create',      'Invite or create CMS users.',     'users'),
  ('00000000-0000-0000-0000-000000000037', 'View Users',        'users.read',        'View CMS user profiles.',         'users'),
  ('00000000-0000-0000-0000-000000000038', 'Update Users',      'users.update',      'Edit CMS user profiles.',         'users'),
  ('00000000-0000-0000-0000-000000000039', 'Delete Users',      'users.delete',      'Remove CMS users.',               'users'),

  -- Settings
  ('00000000-0000-0000-0000-00000000003A', 'View Settings',     'settings.read',     'View global settings.',           'settings'),
  ('00000000-0000-0000-0000-00000000003B', 'Update Settings',   'settings.update',   'Modify global settings.',         'settings'),

  -- Leads
  ('00000000-0000-0000-0000-00000000003C', 'View Leads',        'leads.read',        'View incoming leads.',            'leads'),
  ('00000000-0000-0000-0000-00000000003D', 'Update Leads',      'leads.update',      'Edit lead details and status.',   'leads'),
  ('00000000-0000-0000-0000-00000000003E', 'Manage Leads',      'leads.manage',      'Full lead lifecycle management.', 'leads'),

  -- Navigation
  ('00000000-0000-0000-0000-00000000003F', 'View Navigation',   'navigation.read',   'View navigation structure.',      'navigation'),
  ('00000000-0000-0000-0000-000000000040', 'Update Navigation', 'navigation.update', 'Edit navigation items.',          'navigation'),

  -- Team
  ('00000000-0000-0000-0000-000000000041', 'Create Team',       'team.create',       'Add team members.',               'team'),
  ('00000000-0000-0000-0000-000000000042', 'View Team',         'team.read',         'View team member profiles.',      'team'),
  ('00000000-0000-0000-0000-000000000043', 'Update Team',       'team.update',       'Edit team member profiles.',      'team'),
  ('00000000-0000-0000-0000-000000000044', 'Delete Team',       'team.delete',       'Remove team members.',            'team')
ON CONFLICT (slug) DO NOTHING;


-- ============================================================================
-- 4. ROLE_PERMISSIONS
-- ============================================================================

-- Super Admin: ALL permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000010'::uuid, id
FROM public.permissions
ON CONFLICT DO NOTHING;

-- Admin: everything except user management and settings update
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000011'::uuid, id
FROM public.permissions
WHERE slug NOT IN ('users.create', 'users.delete', 'settings.update')
ON CONFLICT DO NOTHING;

-- Editor: content CRUD + publish + media + team read
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000012'::uuid, id
FROM public.permissions
WHERE slug IN (
  'pages.create', 'pages.read', 'pages.update', 'pages.delete', 'pages.publish',
  'projects.create', 'projects.read', 'projects.update', 'projects.delete', 'projects.publish',
  'solutions.create', 'solutions.read', 'solutions.update', 'solutions.delete',
  'industries.create', 'industries.read', 'industries.update', 'industries.delete',
  'media.create', 'media.read', 'media.update', 'media.delete',
  'team.read', 'navigation.read'
)
ON CONFLICT DO NOTHING;

-- Content Manager: content CRUD + publish + team management
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000013'::uuid, id
FROM public.permissions
WHERE slug IN (
  'pages.create', 'pages.read', 'pages.update', 'pages.delete', 'pages.publish',
  'projects.create', 'projects.read', 'projects.update', 'projects.delete', 'projects.publish',
  'solutions.create', 'solutions.read', 'solutions.update', 'solutions.delete',
  'industries.create', 'industries.read', 'industries.update', 'industries.delete',
  'media.create', 'media.read', 'media.update', 'media.delete',
  'team.create', 'team.read', 'team.update', 'team.delete',
  'navigation.read', 'navigation.update'
)
ON CONFLICT DO NOTHING;

-- Marketing: read access + leads + marketing content
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000014'::uuid, id
FROM public.permissions
WHERE slug IN (
  'pages.read', 'projects.read', 'projects.update',
  'solutions.read', 'industries.read',
  'media.read', 'media.create',
  'leads.read', 'leads.update',
  'navigation.read', 'team.read'
)
ON CONFLICT DO NOTHING;

-- Sales: leads management + read access to client-facing content
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000015'::uuid, id
FROM public.permissions
WHERE slug IN (
  'pages.read', 'projects.read', 'solutions.read', 'industries.read',
  'leads.read', 'leads.update', 'leads.manage',
  'team.read', 'media.read'
)
ON CONFLICT DO NOTHING;

-- Viewer: read-only access across the board
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000016'::uuid, id
FROM public.permissions
WHERE slug LIKE '%.read' OR slug = 'settings.read'
ON CONFLICT DO NOTHING;


-- ============================================================================
-- 5. DEFAULT ADMIN USER
-- ============================================================================
-- NOTE: The corresponding Supabase auth.users row MUST exist before this
-- INSERT succeeds. Create the auth user via Supabase Auth API first.
-- If the auth user does not yet exist, this INSERT is silently skipped.

DO $$
BEGIN
  INSERT INTO public.users (
    id, org_id, email, name, role_id, department_id, is_active
  ) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'admin@bytebuildit.com',
    'Admin',
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000050',
    true
  )
  ON CONFLICT (id) DO NOTHING;
EXCEPTION
  WHEN foreign_key_violation THEN
    RAISE NOTICE 'Admin CMS profile skipped — auth.users row not found. Create via Supabase Auth first.';
END $$;


-- ============================================================================
-- 6. DEPARTMENTS
-- ============================================================================

INSERT INTO public.departments (id, org_id, name, slug, description, ordering) VALUES
  ('00000000-0000-0000-0000-000000000050', '00000000-0000-0000-0000-000000000001', 'Management',   'management',   'Leadership and strategic direction.',                           1),
  ('00000000-0000-0000-0000-000000000051', '00000000-0000-0000-0000-000000000001', 'Engineering',  'engineering',  'Software architecture, development, and infrastructure.',       2),
  ('00000000-0000-0000-0000-000000000052', '00000000-0000-0000-0000-000000000001', 'Design',       'design',       'Product design, UI/UX, and brand identity.',                   3),
  ('00000000-0000-0000-0000-000000000053', '00000000-0000-0000-0000-000000000001', 'Marketing',    'marketing',    'Growth strategy, content, and brand communication.',            4),
  ('00000000-0000-0000-0000-000000000054', '00000000-0000-0000-0000-000000000001', 'Sales',        'sales',        'Client acquisition, partnerships, and revenue operations.',     5),
  ('00000000-0000-0000-0000-000000000055', '00000000-0000-0000-0000-000000000001', 'Operations',   'operations',   'Project delivery, quality assurance, and internal processes.',  6)
ON CONFLICT (org_id, slug) DO NOTHING;


-- ============================================================================
-- 7. PROJECTS (8 case studies)
-- ============================================================================

-- 7a. OrderShield
INSERT INTO public.projects (
  id, org_id, title, slug, short_description, full_description,
  problem, solution, outcomes,
  year, status, is_featured, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000070',
  '00000000-0000-0000-0000-000000000001',
  'OrderShield',
  'ordershield',
  'Order Management Platform',
  'OrderShield is a unified order management platform built for mid-market retailers who process hundreds of orders daily across multiple channels. The system consolidates orders from web stores, marketplaces, and manual entries into a single dashboard — eliminating the spreadsheet chaos that slows operations down.

The platform features real-time order status tracking, automated inventory checks, role-based access for warehouse and fulfillment teams, and comprehensive analytics that surface bottlenecks before they become customer-facing problems. Every order flows through configurable stages with automatic notifications and escalation rules.

Since deployment, the client has reduced order processing time by 62%, virtually eliminated double-entry errors, and gained real-time visibility into fulfillment status across all channels — turning a fragmented operation into one connected system.',
  'The client, a growing retail operation, was managing orders through a patchwork of spreadsheets, email threads, and three separate platform dashboards. Order status updates were manually communicated between the warehouse and customer service teams, leading to frequent delays, miscommunication, and a growing backlog of unresolved order issues that was eroding customer satisfaction.',
  'We built OrderShield as a centralized order management system with a real-time dashboard that pulls orders from all sales channels into one interface. The platform includes automated inventory validation, configurable order workflows with stage-based routing, role-based permissions for warehouse staff and customer service reps, and push notifications for order status changes and exceptions.',
  'Order processing time dropped by 62%, double-entry errors were eliminated, and customer satisfaction scores improved significantly. The client now has full real-time visibility into order status across all channels, and the warehouse team can handle 3x the previous order volume without additional headcount.',
  2024, 'published', true, 1
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 7b. Clinic Queue Management
INSERT INTO public.projects (
  id, org_id, title, slug, short_description, full_description,
  problem, solution, outcomes,
  year, status, is_featured, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000071',
  '00000000-0000-0000-0000-000000000001',
  'Clinic Queue Management',
  'clinic-queue-management',
  'Healthcare Platform',
  'Clinic Queue Management is a real-time patient flow system designed for outpatient clinics and diagnostic centers handling high patient volumes. The platform digitizes the entire patient journey — from check-in and queue assignment to consultation and checkout — replacing the physical token-based systems that create bottlenecks and patient frustration.

The system provides front-desk staff with a live dashboard showing queue depth, estimated wait times per doctor, and patient priority levels. Patients receive real-time queue updates on a waiting room display and via SMS, reducing perceived wait times and walkaway rates. Analytics surfaces peak hours, average consultation durations, and throughput metrics that help clinic managers optimize scheduling.',
  'The client operated multiple outpatient clinics where patients queued physically with paper tokens. Front-desk staff had no visibility into real-time queue depth, doctors frequently ran behind schedule without any automated alerting, and patients had no way to know estimated wait times — resulting in walkaways, complaints, and inefficient utilization of consultation rooms.',
  'We developed a cloud-based queue management platform with real-time patient tracking across all clinic locations. The system includes a digital check-in flow, intelligent queue assignment based on doctor availability and patient priority, live waiting room displays, automated SMS notifications for queue position updates, and a management dashboard with throughput analytics and scheduling optimization tools.',
  'Patient walkaway rates decreased by 45%, average check-in time dropped from 8 minutes to under 2 minutes, and clinic managers gained real-time visibility into patient flow across all locations. The analytics dashboard revealed scheduling patterns that enabled a 20% improvement in doctor utilization rates.',
  2024, 'published', true, 2
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 7c. Sherazi GPS Tracker
INSERT INTO public.projects (
  id, org_id, title, slug, short_description, full_description,
  problem, solution, outcomes,
  year, status, is_featured, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000072',
  '00000000-0000-0000-0000-000000000001',
  'Sherazi GPS Tracker',
  'sherazi-gps-tracker',
  'Fleet Management System',
  'Sherazi GPS Tracker is a fleet management system that gives logistics operators real-time visibility into vehicle locations, driver behavior, and route efficiency. Built for a transportation company managing a fleet of over 150 vehicles, the platform replaces manual check-in calls and paper trip sheets with continuous GPS tracking and automated reporting.

The system provides a live map view of all vehicles, geofencing capabilities for depot and delivery zone monitoring, and driver scorecards that track harsh braking, speeding, idle time, and route adherence. Automated alerts notify dispatchers of route deviations, unauthorized stops, and maintenance schedule requirements.',
  'The client was managing a fleet of 150+ vehicles with phone-based check-ins and paper trip logs. Dispatchers had no real-time visibility into vehicle locations, fuel consumption was unmonitored, and driver accountability was limited to post-trip manual reports. This made it impossible to optimize routes, prevent fuel theft, or respond proactively to delivery delays.',
  'We built a GPS tracking and fleet management platform that connects to OBD-II devices installed in each vehicle. The system streams real-time location data to a central dashboard, enforces geofencing rules for depots and delivery zones, generates automated driver behavior scorecards, tracks fuel consumption patterns, and provides route optimization recommendations based on historical trip data and traffic patterns.',
  'Fuel costs decreased by 18% within the first quarter, on-time delivery rates improved from 76% to 94%, and dispatcher workload was reduced by 40% through automated alerting. The real-time visibility enabled the operations team to dynamically reassign deliveries and reduce average trip completion times.',
  2024, 'published', true, 3
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 7d. Qttenzy
INSERT INTO public.projects (
  id, org_id, title, slug, short_description, full_description,
  problem, solution, outcomes,
  year, status, is_featured, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000073',
  '00000000-0000-0000-0000-000000000001',
  'Qttenzy',
  'qttenzy',
  'Workforce Management',
  'Qttenzy is a workforce management platform that automates attendance tracking, shift scheduling, and employee time management for businesses with distributed teams. The system replaces biometric-only setups and manual timesheets with a mobile-first attendance solution backed by geolocation verification and automated payroll-ready reporting.

Employees clock in and out through a mobile app with GPS verification, while managers access a dashboard showing real-time attendance status, shift coverage, overtime calculations, and leave balances. The platform integrates with payroll systems to eliminate manual data entry and reduce processing errors.',
  'The client managed a workforce of 500+ employees across multiple locations using a combination of biometric devices and manual spreadsheets. Attendance reconciliation took two full days each month, shift scheduling was done via phone calls and WhatsApp groups, and there was no automated way to calculate overtime or track leave balances — leading to frequent payroll disputes.',
  'We developed Qttenzy as a mobile-first workforce management system with GPS-verified attendance, automated shift scheduling with conflict detection, real-time attendance dashboards, leave management with approval workflows, overtime calculation based on configurable rules, and payroll-ready export reports. The system supports multiple locations and role-based access for managers and HR staff.',
  'Monthly attendance reconciliation dropped from 2 days to 15 minutes, payroll processing errors decreased by 89%, and employee satisfaction improved due to transparent time tracking. The automated scheduling feature reduced unfilled shifts by 70% and gave managers real-time visibility into workforce availability.',
  2024, 'published', true, 4
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 7e. CommerceCore
INSERT INTO public.projects (
  id, org_id, title, slug, short_description, full_description,
  problem, solution, outcomes,
  year, status, is_featured, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000074',
  '00000000-0000-0000-0000-000000000001',
  'CommerceCore',
  'commercecore',
  'E-Commerce Platform',
  'CommerceCore is a modern e-commerce platform built to replace a legacy PHP-based online store that had become a bottleneck for growth. The new platform features a headless architecture with a Next.js frontend, a RESTful API backend, and PostgreSQL — delivering sub-second page loads, a flexible product management system, and the scalability to handle traffic spikes during sales campaigns.

The platform includes product catalog management with variants and attributes, a multi-step checkout with multiple payment gateway support, inventory synchronization across warehouse locations, coupon and discount engines, and a comprehensive admin dashboard for order management and analytics.',
  'The client was running an aging PHP e-commerce platform that struggled with performance during traffic spikes, required developer intervention for basic catalog changes, and could not support the multi-warehouse inventory model they needed to scale. Page load times exceeded 4 seconds, checkout abandonment rates were climbing, and the platform lacked the extensibility to support new sales channels.',
  'We rebuilt the e-commerce platform from the ground up using a headless architecture. The frontend was built with Next.js for server-side rendering and sub-second page loads, the backend provides a RESTful API with JWT authentication and role-based access, and the database layer uses PostgreSQL with Redis caching. The system includes a product information management module, automated inventory sync across warehouse locations, and integrations with bKash, Nagad, and Stripe for payments.',
  'Page load times dropped from 4+ seconds to under 800ms, checkout abandonment decreased by 34%, and the client can now manage their full product catalog without developer involvement. The platform handled a 10x traffic spike during their annual sale event with zero downtime, and multi-warehouse inventory sync eliminated overselling issues.',
  2024, 'published', true, 5
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 7f. LeadLayer
INSERT INTO public.projects (
  id, org_id, title, slug, short_description, full_description,
  problem, solution, outcomes,
  year, status, is_featured, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000075',
  '00000000-0000-0000-0000-000000000001',
  'LeadLayer',
  'leadlayer',
  'CRM System',
  'LeadLayer is a purpose-built CRM system for B2B service companies that need to manage their sales pipeline without the complexity and cost of enterprise platforms like Salesforce. The system tracks leads from first contact through proposal and close, with automated follow-up reminders, pipeline analytics, and team performance metrics.

The platform features a visual kanban pipeline, lead scoring based on configurable criteria, automated email follow-up sequences, a centralized communication log for each lead, and reporting dashboards that show conversion rates, average deal cycle times, and revenue forecasts.',
  'The client, a professional services firm, was tracking potential clients across personal email inboxes, spreadsheets, and sticky notes. Leads frequently fell through the cracks due to lack of follow-up, there was no visibility into pipeline health, and the sales team had no data-driven way to prioritize high-value opportunities over low-probability prospects.',
  'We built LeadLayer as a lightweight but powerful CRM with a visual pipeline interface, automated follow-up scheduling, lead scoring based on engagement signals and qualification criteria, a unified communication history for each contact, and customizable reporting. The system integrates with email and provides mobile access for sales reps on the go.',
  'Lead response time decreased from an average of 3 days to under 4 hours, pipeline visibility gave management accurate revenue forecasts for the first time, and the sales team closed 28% more deals in the first quarter after deployment. Automated follow-up sequences ensured zero leads were dropped.',
  2024, 'published', false, 6
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 7g. Commeriq
INSERT INTO public.projects (
  id, org_id, title, slug, short_description, full_description,
  problem, solution, outcomes,
  year, status, is_featured, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000076',
  '00000000-0000-0000-0000-000000000001',
  'Commeriq',
  'commeriq',
  'Business Intelligence',
  'Commeriq is a business intelligence platform that transforms raw operational data into actionable insights for retail and e-commerce businesses. The system pulls data from point-of-sale systems, e-commerce platforms, inventory management, and marketing tools into a unified analytics layer — giving business owners a single source of truth without requiring SQL knowledge or BI expertise.

The platform features automated daily reports, customizable dashboards with drag-and-drop widgets, anomaly detection that flags unusual sales patterns or inventory movements, and predictive analytics for demand forecasting that help businesses optimize purchasing and staffing decisions.',
  'The client was making purchasing and marketing decisions based on gut instinct and fragmented data spread across multiple spreadsheets and platform dashboards. They had no unified view of business performance, could not identify which products or channels were most profitable, and were consistently over- or under-stocking based on guesswork rather than data.',
  'We built Commeriq as a data aggregation and analytics platform that connects to the clients existing tools via API, normalizes the data into a consistent schema, and presents it through an intuitive dashboard interface. The system includes automated anomaly detection, trend analysis, demand forecasting using historical patterns, and customizable report generation that can be scheduled and emailed to stakeholders.',
  'The client made their first data-driven purchasing decision within two weeks of deployment, reducing dead stock by 35%. Marketing spend allocation improved with channel-level profitability data, and the automated anomaly detection caught a pricing error that would have cost the business thousands. Revenue grew 22% year-over-year after implementing the forecast-driven restocking model.',
  2024, 'published', false, 7
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 7h. SHAP-Driven Career Predictor
INSERT INTO public.projects (
  id, org_id, title, slug, short_description, full_description,
  problem, solution, outcomes,
  year, status, is_featured, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000077',
  '00000000-0000-0000-0000-000000000001',
  'SHAP-Driven Career Predictor',
  'shap-career-predictor',
  'AI Career Platform',
  'The SHAP-Driven Career Predictor is an AI-powered platform that provides personalized career guidance by analyzing individual skill profiles, market demand data, and career trajectories using SHAP (SHapley Additive exPlanations) for model interpretability. Unlike generic career advice tools, it explains exactly which skills and experiences are driving its recommendations — making the guidance transparent and actionable.

The platform takes a user assessment of current skills, education, and experience, then uses a trained machine learning model to predict career paths with the highest probability of success. SHAP values decompose each recommendation into contributing factors, showing users exactly what to focus on developing and why.',
  'Career counseling for students and early-career professionals in the region relies heavily on generic advice, anecdotal experience, and outdated information about market demand. Students choose career paths based on social pressure or hearsay rather than data-driven analysis of their individual strengths and actual market opportunities — leading to high mismatch rates between education and employment.',
  'We built an AI-powered career prediction system that combines a machine learning model trained on career trajectory data with SHAP-based explainability. Users complete a skills and background assessment, the model generates probability-ranked career path recommendations, and each recommendation is decomposed into transparent feature contributions showing which skills, qualifications, or experiences are most influential. The platform includes a market demand overlay that shows salary ranges and job availability for each recommended path.',
  'The platform achieved 78% accuracy in predicting career outcomes within a 3-year horizon during beta testing with 500 university students. Users reported that SHAP explanations made the recommendations feel trustworthy and actionable — 85% of users changed at least one skill development priority based on the insights. The university partnership reduced career counseling workload by 60% while improving student satisfaction scores.',
  2024, 'published', false, 8
) ON CONFLICT (org_id, slug) DO NOTHING;


-- ============================================================================
-- 7.1 PROJECT_TECHNOLOGIES (associated tech stacks)
-- ============================================================================

INSERT INTO public.project_technologies (project_id, technology) VALUES
  -- OrderShield
  ('00000000-0000-0000-0000-000000000070', 'Next.js'),
  ('00000000-0000-0000-0000-000000000070', 'TypeScript'),
  ('00000000-0000-0000-0000-000000000070', 'PostgreSQL'),
  ('00000000-0000-0000-0000-000000000070', 'Supabase'),
  ('00000000-0000-0000-0000-000000000070', 'Tailwind CSS'),
  -- Clinic Queue Management
  ('00000000-0000-0000-0000-000000000071', 'React'),
  ('00000000-0000-0000-0000-000000000071', 'Node.js'),
  ('00000000-0000-0000-0000-000000000071', 'PostgreSQL'),
  ('00000000-0000-0000-0000-000000000071', 'WebSocket'),
  ('00000000-0000-0000-0000-000000000071', 'Redis'),
  -- Sherazi GPS Tracker
  ('00000000-0000-0000-0000-000000000072', 'Next.js'),
  ('00000000-0000-0000-0000-000000000072', 'PostgreSQL'),
  ('00000000-0000-0000-0000-000000000072', 'Redis'),
  ('00000000-0000-0000-0000-000000000072', 'Mapbox GL'),
  ('00000000-0000-0000-0000-000000000072', 'MQTT'),
  -- Qttenzy
  ('00000000-0000-0000-0000-000000000073', 'React Native'),
  ('00000000-0000-0000-0000-000000000073', 'Node.js'),
  ('00000000-0000-0000-0000-000000000073', 'PostgreSQL'),
  ('00000000-0000-0000-0000-000000000073', 'Supabase'),
  ('00000000-0000-0000-0000-000000000073', 'TypeScript'),
  -- CommerceCore
  ('00000000-0000-0000-0000-000000000074', 'Next.js'),
  ('00000000-0000-0000-0000-000000000074', 'PostgreSQL'),
  ('00000000-0000-0000-0000-000000000074', 'Redis'),
  ('00000000-0000-0000-0000-000000000074', 'Stripe'),
  ('00000000-0000-0000-0000-000000000074', 'Tailwind CSS'),
  -- LeadLayer
  ('00000000-0000-0000-0000-000000000075', 'Next.js'),
  ('00000000-0000-0000-0000-000000000075', 'TypeScript'),
  ('00000000-0000-0000-0000-000000000075', 'PostgreSQL'),
  ('00000000-0000-0000-0000-000000000075', 'Supabase'),
  ('00000000-0000-0000-0000-000000000075', 'Resend'),
  -- Commeriq
  ('00000000-0000-0000-0000-000000000076', 'Next.js'),
  ('00000000-0000-0000-0000-000000000076', 'Python'),
  ('00000000-0000-0000-0000-000000000076', 'PostgreSQL'),
  ('00000000-0000-0000-0000-000000000076', 'Redis'),
  ('00000000-0000-0000-0000-000000000076', 'Apache Kafka'),
  -- SHAP-Driven Career Predictor
  ('00000000-0000-0000-0000-000000000077', 'Next.js'),
  ('00000000-0000-0000-0000-000000000077', 'Python'),
  ('00000000-0000-0000-0000-000000000077', 'scikit-learn'),
  ('00000000-0000-0000-0000-000000000077', 'SHAP'),
  ('00000000-0000-0000-0000-000000000077', 'PostgreSQL')
ON CONFLICT (project_id, technology) DO NOTHING;


-- ============================================================================
-- 8. INDUSTRIES
-- ============================================================================

-- 8a. Healthcare
INSERT INTO public.industries (
  id, org_id, title, slug, overview, problems, solutions, status, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000080',
  '00000000-0000-0000-0000-000000000001',
  'Healthcare',
  'healthcare',
  'Healthcare providers face mounting pressure to deliver quality care while managing complex operational workflows. From patient scheduling and queue management to records and billing, the industry demands systems that reduce administrative burden and let clinicians focus on patients.',
  ARRAY[
    'Manual patient queue management leading to long wait times and walkaways',
    'Paper-based records creating silos and increasing the risk of data loss',
    'Lack of real-time visibility into doctor availability and clinic throughput',
    'Delayed communication between departments causing billing and referral errors'
  ],
  ARRAY[
    'Digital queue management systems with real-time wait time displays',
    'Electronic health record integration for seamless patient data access',
    'Automated appointment scheduling with doctor availability tracking',
    'Inter-department communication workflows with status notifications'
  ],
  'published', 1
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 8b. Retail
INSERT INTO public.industries (
  id, org_id, title, slug, overview, problems, solutions, status, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000081',
  '00000000-0000-0000-0000-000000000001',
  'Retail',
  'retail',
  'Retail businesses juggle inventory across channels, manage high-volume order processing, and compete on customer experience — all while margins stay thin. Modern retail demands integrated systems that connect storefront, warehouse, and digital channels into one operation.',
  ARRAY[
    'Fragmented inventory management across physical and digital channels',
    'Manual order processing leading to errors and fulfillment delays',
    'No unified customer view across touchpoints and purchase history',
    'Complex multi-channel operations with disconnected data sources'
  ],
  ARRAY[
    'Centralized inventory systems with real-time stock synchronization',
    'Automated order processing workflows with status tracking',
    'Customer data platforms that unify purchase history and behavior',
    'Multi-channel integration connecting POS, e-commerce, and marketplace data'
  ],
  'published', 2
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 8c. Fleet & Logistics
INSERT INTO public.industries (
  id, org_id, title, slug, overview, problems, solutions, status, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000082',
  '00000000-0000-0000-0000-000000000001',
  'Fleet & Logistics',
  'fleet-logistics',
  'Fleet operators and logistics companies live and die by visibility — knowing where vehicles are, how drivers are performing, and whether routes are efficient. Without real-time tracking and data-driven route planning, fuel costs climb and delivery reliability suffers.',
  ARRAY[
    'Inefficient route planning resulting in excess fuel consumption and late deliveries',
    'No real-time vehicle tracking making dispatch decisions reactive',
    'High fuel costs with no data to identify waste or optimize usage',
    'Paper-based delivery confirmations slowing proof-of-delivery workflows'
  ],
  ARRAY[
    'GPS-based fleet tracking with real-time location dashboards',
    'Route optimization algorithms that reduce mileage and transit time',
    'Fuel consumption analytics with anomaly detection and alerts',
    'Digital proof of delivery with photo capture and electronic signatures'
  ],
  'published', 3
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 8d. Education
INSERT INTO public.industries (
  id, org_id, title, slug, overview, problems, solutions, status, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000083',
  '00000000-0000-0000-0000-000000000001',
  'Education',
  'education',
  'Educational institutions need technology that goes beyond digital textbooks — they need systems that personalize learning, provide data-driven insights into student progress, and prepare learners for careers based on actual market demand rather than generic career advice.',
  ARRAY[
    'Generic career guidance disconnected from individual student strengths',
    'Manual student tracking making progress monitoring time-intensive',
    'Limited data-driven insights into learning outcomes and gaps',
    'One-size-fits-all counseling that ignores market demand signals'
  ],
  ARRAY[
    'AI-powered career prediction based on skill profiles and market data',
    'Automated student progress tracking with milestone dashboards',
    'Data-driven learning analytics that identify gaps and recommend interventions',
    'Personalized learning paths aligned with real employment market signals'
  ],
  'published', 4
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 8e. Restaurants
INSERT INTO public.industries (
  id, org_id, title, slug, overview, problems, solutions, status, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000084',
  '00000000-0000-0000-0000-000000000001',
  'Restaurants',
  'restaurants',
  'Restaurant operators need real-time control over inventory, orders, and multi-location coordination. The margin between profitability and loss often comes down to how efficiently you manage food costs, staffing, and customer throughput during peak hours.',
  ARRAY[
    'Manual inventory tracking leading to waste and stockout situations',
    'Inefficient order management during peak hours causing delays',
    'No real-time sales analytics to inform purchasing and staffing decisions',
    'Complex multi-location coordination with inconsistent reporting'
  ],
  ARRAY[
    'Automated inventory tracking with low-stock alerts and waste analytics',
    'Streamlined order management with kitchen display integration',
    'Real-time sales dashboards with hourly and category-level insights',
    'Centralized multi-location management with consolidated reporting'
  ],
  'published', 5
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 8f. Professional Services
INSERT INTO public.industries (
  id, org_id, title, slug, overview, problems, solutions, status, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000085',
  '00000000-0000-0000-0000-000000000001',
  'Professional Services',
  'professional-services',
  'Consulting firms, agencies, and professional service providers sell expertise — but managing the business behind that expertise often relies on fragmented tools. From lead capture to project delivery, the operational gap between winning work and completing it can be costly.',
  ARRAY[
    'Scattered lead management across email inboxes and spreadsheets',
    'Manual follow-up processes resulting in missed opportunities',
    'No pipeline visibility making revenue forecasting unreliable',
    'Inefficient client communication leading to scope creep and disputes'
  ],
  ARRAY[
    'Automated CRM systems with lead scoring and pipeline tracking',
    'Scheduled follow-up sequences that prevent leads from falling through cracks',
    'Pipeline analytics dashboards for data-driven revenue forecasting',
    'Centralized client communication logs with project milestone tracking'
  ],
  'published', 6
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 8g. SMEs
INSERT INTO public.industries (
  id, org_id, title, slug, overview, problems, solutions, status, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000086',
  '00000000-0000-0000-0000-000000000001',
  'SMEs',
  'smes',
  'Small and medium enterprises are the backbone of the economy but often lack the tools that larger competitors take for granted. Affordable, focused software solutions can transform how an SME operates — turning manual processes into automated workflows without enterprise-level complexity or cost.',
  ARRAY[
    'Manual attendance and time tracking leading to payroll disputes',
    'Paper-based workflows consuming hours of productive time each week',
    'Lack of automation forcing repetitive tasks that could be systematized',
    'No centralized platform for business operations and reporting'
  ],
  ARRAY[
    'Automated attendance systems with GPS verification and reporting',
    'Digital workflow management with task assignment and tracking',
    'Business process automation for invoicing, approvals, and notifications',
    'Integrated operations platforms that unify core business functions'
  ],
  'published', 7
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 8h. Manufacturing
INSERT INTO public.industries (
  id, org_id, title, slug, overview, problems, solutions, status, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000087',
  '00000000-0000-0000-0000-000000000001',
  'Manufacturing',
  'manufacturing',
  'Manufacturers need real-time visibility into production lines, quality metrics, and supply chain coordination. The difference between meeting targets and missing them often comes down to how quickly you can detect and respond to operational issues on the factory floor.',
  ARRAY[
    'Disconnected production lines making it hard to identify bottlenecks',
    'Manual quality checks introducing delays and human error',
    'No real-time production data for informed decision-making',
    'Inefficient supply chain coordination causing material shortages'
  ],
  ARRAY[
    'IoT-connected production monitoring with real-time line status',
    'Automated quality control systems with defect detection and alerting',
    'Production dashboards with OEE, throughput, and downtime analytics',
    'Supply chain integration platforms for automated material ordering'
  ],
  'published', 8
) ON CONFLICT (org_id, slug) DO NOTHING;


-- ============================================================================
-- 9. SOLUTIONS (6 categories)
-- ============================================================================

-- 9a. Business Systems
INSERT INTO public.solutions (
  id, org_id, title, slug, description, category, capabilities, status, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000090',
  '00000000-0000-0000-0000-000000000001',
  'Business Systems',
  'business-systems',
  'Custom software systems that replace fragmented manual processes with integrated, automated workflows. We build CRM, ERP, order management, and operational platforms tailored to how your business actually works — not off-the-shelf tools that force you to adapt.',
  'business_systems',
  ARRAY[
    'CRM and pipeline management platforms',
    'Order management and fulfillment systems',
    'Inventory tracking with multi-location sync',
    'Custom ERP modules for your specific operations',
    'Workflow automation across departments'
  ],
  'published', 1
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 9b. Industry Software
INSERT INTO public.solutions (
  id, org_id, title, slug, description, category, capabilities, status, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000091',
  '00000000-0000-0000-0000-000000000001',
  'Industry Software',
  'industry-software',
  'Purpose-built software for specific industries — healthcare, logistics, hospitality, and more. We understand the unique workflows, compliance requirements, and operational realities of each sector, and build systems that solve industry-specific problems rather than generic ones.',
  'industry_software',
  ARRAY[
    'Healthcare queue and patient flow management',
    'Fleet tracking and logistics coordination',
    'Restaurant operations and inventory systems',
    'Industry-specific compliance and reporting',
    'Sector-tailored dashboards and analytics'
  ],
  'published', 2
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 9c. Automation
INSERT INTO public.solutions (
  id, org_id, title, slug, description, category, capabilities, status, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000092',
  '00000000-0000-0000-0000-000000000001',
  'Automation',
  'automation',
  'We identify the repetitive, time-consuming tasks in your operations and build systems that handle them automatically. From attendance tracking and invoice processing to data synchronization and report generation — automation eliminates human error and frees your team for higher-value work.',
  'automation',
  ARRAY[
    'Attendance and workforce management automation',
    'Automated data synchronization across platforms',
    'Invoice generation and payment tracking workflows',
    'Scheduled reporting and alert systems',
    'Document processing and approval chains'
  ],
  'published', 3
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 9d. AI & Intelligence
INSERT INTO public.solutions (
  id, org_id, title, slug, description, category, capabilities, status, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000093',
  '00000000-0000-0000-0000-000000000001',
  'AI & Intelligence',
  'ai-intelligence',
  'AI systems that go beyond hype to deliver real business value. We build predictive analytics, recommendation engines, and intelligent automation that transform your data into decisions — with full explainability so you understand why the system recommends what it does.',
  'ai_intelligence',
  ARRAY[
    'Predictive analytics and demand forecasting',
    'AI-powered recommendation engines',
    'Anomaly detection and intelligent alerting',
    'Natural language processing for data extraction',
    'Explainable AI with transparent decision rationale'
  ],
  'published', 4
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 9e. Digital Products
INSERT INTO public.solutions (
  id, org_id, title, slug, description, category, capabilities, status, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000094',
  '00000000-0000-0000-0000-000000000001',
  'Digital Products',
  'digital-products',
  'End-to-end product development from concept to launch. We design and build web applications, mobile apps, and SaaS platforms with modern architectures that scale. Our focus is on products that solve real problems with clean interfaces and reliable backends.',
  'digital_products',
  ARRAY[
    'Full-stack web application development',
    'Mobile apps for iOS and Android',
    'SaaS platform architecture and development',
    'E-commerce platforms with payment integration',
    'API design and third-party integrations'
  ],
  'published', 5
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 9f. Infrastructure
INSERT INTO public.solutions (
  id, org_id, title, slug, description, category, capabilities, status, ordering
) VALUES (
  '00000000-0000-0000-0000-000000000095',
  '00000000-0000-0000-0000-000000000001',
  'Infrastructure',
  'infrastructure',
  'The foundation that makes everything else work. We set up cloud infrastructure, CI/CD pipelines, monitoring, and security practices that keep your systems running reliably at scale — so you can focus on your business, not your servers.',
  'infrastructure',
  ARRAY[
    'Cloud architecture design and deployment',
    'CI/CD pipeline setup and DevOps practices',
    'Database design, optimization, and migration',
    'Security auditing and hardening',
    'Performance monitoring and incident response'
  ],
  'published', 6
) ON CONFLICT (org_id, slug) DO NOTHING;


-- ============================================================================
-- 10. NAVIGATION ITEMS
-- ============================================================================

-- Primary navigation
INSERT INTO public.navigation_items (id, org_id, label, url, nav_location, ordering) VALUES
  ('00000000-0000-0000-0000-0000000000A0', '00000000-0000-0000-0000-000000000001', 'Work',      '/work',      'primary', 1),
  ('00000000-0000-0000-0000-0000000000A1', '00000000-0000-0000-0000-000000000001', 'Solutions', '/solutions', 'primary', 2),
  ('00000000-0000-0000-0000-0000000000A2', '00000000-0000-0000-0000-000000000001', 'Approach',  '/about',     'primary', 3),
  ('00000000-0000-0000-0000-0000000000A3', '00000000-0000-0000-0000-000000000001', 'About',      '/about',     'primary', 4)
ON CONFLICT (id) DO NOTHING;

-- Footer navigation
INSERT INTO public.navigation_items (id, org_id, label, url, nav_location, ordering) VALUES
  ('00000000-0000-0000-0000-0000000000A4', '00000000-0000-0000-0000-000000000001', 'Work',           '/work',        'footer', 1),
  ('00000000-0000-0000-0000-0000000000A5', '00000000-0000-0000-0000-000000000001', 'Solutions',      '/solutions',   'footer', 2),
  ('00000000-0000-0000-0000-0000000000A6', '00000000-0000-0000-0000-000000000001', 'Industries',     '/industries',  'footer', 3),
  ('00000000-0000-0000-0000-0000000000A7', '00000000-0000-0000-0000-000000000001', 'About',          '/about',       'footer', 4),
  ('00000000-0000-0000-0000-0000000000A8', '00000000-0000-0000-0000-000000000001', 'Contact',        '/contact',     'footer', 5),
  ('00000000-0000-0000-0000-0000000000A9', '00000000-0000-0000-0000-000000000001', 'Privacy Policy', '/privacy',     'footer', 6)
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 11. SETTINGS (global configuration)
-- ============================================================================

INSERT INTO public.settings (id, org_id, key, value, category) VALUES
  ('00000000-0000-0000-0000-0000000000B0', '00000000-0000-0000-0000-000000000001', 'company_name',          '"ByteBuildIT"'::jsonb,                                                                                             'general'),
  ('00000000-0000-0000-0000-0000000000B1', '00000000-0000-0000-0000-000000000001', 'tagline',               '"We turn inefficient business processes into software."'::jsonb,                                                      'general'),
  ('00000000-0000-0000-0000-0000000000B2', '00000000-0000-0000-0000-000000000001', 'email',                 '"hello@bytebuildit.com"'::jsonb,                                                                                    'contact'),
  ('00000000-0000-0000-0000-0000000000B3', '00000000-0000-0000-0000-000000000001', 'phone',                 '"+880 1XXX-XXXXXX"'::jsonb,                                                                                        'contact'),
  ('00000000-0000-0000-0000-0000000000B4', '00000000-0000-0000-0000-000000000001', 'copyright',             '"© 2024 ByteBuildIT. All rights reserved."'::jsonb,                                                                  'general'),
  ('00000000-0000-0000-0000-0000000000B5', '00000000-0000-0000-0000-000000000001', 'default_seo_title',     '"ByteBuildIT — We turn inefficient business processes into software"'::jsonb,                                         'seo'),
  ('00000000-0000-0000-0000-0000000000B6', '00000000-0000-0000-0000-000000000001', 'default_seo_description','"Software systems for businesses that have outgrown manual work."'::jsonb,                                             'seo'),
  ('00000000-0000-0000-0000-0000000000B7', '00000000-0000-0000-0000-000000000001', 'maintenance_mode',      'false'::jsonb,                                                                                                      'maintenance')
ON CONFLICT (org_id, key) DO NOTHING;


-- ============================================================================
-- 12. TEAM MEMBERS
-- ============================================================================

-- 12a. Aayan Mushfiqur — Founder & CEO
INSERT INTO public.team_members (
  id, org_id, name, slug, role, bio, is_featured, ordering, status
) VALUES (
  '00000000-0000-0000-0000-000000000060',
  '00000000-0000-0000-0000-000000000001',
  'Aayan Mushfiqur',
  'aayan-mushfiqur',
  'Founder & CEO',
  'Building software systems that transform how businesses operate.',
  true, 1, 'published'
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 12b. Team Member 2 — Lead Engineer
INSERT INTO public.team_members (
  id, org_id, name, slug, role, bio, is_featured, ordering, status
) VALUES (
  '00000000-0000-0000-0000-000000000061',
  '00000000-0000-0000-0000-000000000001',
  'Team Member 2',
  'team-member-2',
  'Lead Engineer',
  'Engineering reliable systems at scale.',
  false, 2, 'published'
) ON CONFLICT (org_id, slug) DO NOTHING;

-- 12c. Team Member 3 — Product Designer
INSERT INTO public.team_members (
  id, org_id, name, slug, role, bio, is_featured, ordering, status
) VALUES (
  '00000000-0000-0000-0000-000000000062',
  '00000000-0000-0000-0000-000000000001',
  'Team Member 3',
  'team-member-3',
  'Product Designer',
  'Designing products that solve real problems.',
  false, 3, 'published'
) ON CONFLICT (org_id, slug) DO NOTHING;


-- ============================================================================
-- Done. Seed data populates: organization, 7 roles, 35 permissions, role-
-- permission mappings, 6 departments, 8 projects (with technologies), 8
-- industries, 6 solutions, 10 navigation items, 8 settings, and 3 team
-- members. All inserts are idempotent via ON CONFLICT DO NOTHING.
-- ============================================================================