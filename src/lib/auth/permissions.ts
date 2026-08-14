// ── Permission Constants ───────────────────────────────────────────
// Organized by entity. Each permission follows the pattern: action_entity
// The string value matches the `name` column in the `permissions` table.

export const PROJECTS = {
  view: "view_projects",
  create: "create_projects",
  edit: "edit_projects",
  publish: "publish_projects",
  delete: "delete_projects",
} as const;

export const SOLUTIONS = {
  view: "view_solutions",
  create: "create_solutions",
  edit: "edit_solutions",
  publish: "publish_solutions",
  delete: "delete_solutions",
} as const;

export const INDUSTRIES = {
  view: "view_industries",
  create: "create_industries",
  edit: "edit_industries",
  delete: "delete_industries",
} as const;

export const TEAM = {
  view: "view_team",
  create: "create_team",
  edit: "edit_team",
  delete: "delete_team",
} as const;

export const LEADS = {
  view: "view_leads",
  edit: "edit_leads",
  assign: "assign_leads",
  delete: "delete_leads",
} as const;

export const PAGES = {
  view: "view_pages",
  create: "create_pages",
  edit: "edit_pages",
  publish: "publish_pages",
  delete: "delete_pages",
} as const;

export const MEDIA = {
  view: "view_media",
  upload: "upload_media",
  delete: "delete_media",
} as const;

export const NAVIGATION = {
  manage: "manage_navigation",
} as const;

export const SETTINGS = {
  manage: "manage_settings",
} as const;

export const SEO = {
  manage: "manage_seo",
} as const;

export const USERS = {
  manage: "manage_users",
} as const;

export const AUDIT = {
  view: "view_audit",
} as const;

// ── All permissions flat list ──────────────────────────────────────

export const ALL_PERMISSIONS = [
  ...Object.values(PROJECTS),
  ...Object.values(SOLUTIONS),
  ...Object.values(INDUSTRIES),
  ...Object.values(TEAM),
  ...Object.values(LEADS),
  ...Object.values(PAGES),
  ...Object.values(MEDIA),
  ...Object.values(NAVIGATION),
  ...Object.values(SETTINGS),
  ...Object.values(SEO),
  ...Object.values(USERS),
  ...Object.values(AUDIT),
] as const;

export type Permission = (typeof ALL_PERMISSIONS)[number];

// ── Role → Permission Mappings ─────────────────────────────────────
// These define default permission sets for each built-in role.
// Actual role data lives in the `roles` and `role_permissions` tables.

export const ROLE_PERMISSIONS: Record<string, readonly Permission[]> = {
  "Super Admin": ALL_PERMISSIONS,

  Admin: [
    PROJECTS.view,
    PROJECTS.create,
    PROJECTS.edit,
    PROJECTS.publish,
    PROJECTS.delete,
    SOLUTIONS.view,
    SOLUTIONS.create,
    SOLUTIONS.edit,
    SOLUTIONS.publish,
    SOLUTIONS.delete,
    INDUSTRIES.view,
    INDUSTRIES.create,
    INDUSTRIES.edit,
    INDUSTRIES.delete,
    TEAM.view,
    TEAM.create,
    TEAM.edit,
    TEAM.delete,
    LEADS.view,
    LEADS.edit,
    LEADS.assign,
    LEADS.delete,
    PAGES.view,
    PAGES.create,
    PAGES.edit,
    PAGES.publish,
    PAGES.delete,
    MEDIA.view,
    MEDIA.upload,
    MEDIA.delete,
    NAVIGATION.manage,
    SETTINGS.manage,
    SEO.manage,
    USERS.manage,
    AUDIT.view,
  ],

  Editor: [
    PROJECTS.view,
    PROJECTS.create,
    PROJECTS.edit,
    PROJECTS.publish,
    SOLUTIONS.view,
    SOLUTIONS.create,
    SOLUTIONS.edit,
    SOLUTIONS.publish,
    INDUSTRIES.view,
    INDUSTRIES.create,
    INDUSTRIES.edit,
    TEAM.view,
    TEAM.create,
    TEAM.edit,
    LEADS.view,
    LEADS.edit,
    PAGES.view,
    PAGES.create,
    PAGES.edit,
    PAGES.publish,
    MEDIA.view,
    MEDIA.upload,
    NAVIGATION.manage,
    SEO.manage,
  ],

  "Content Manager": [
    PROJECTS.view,
    PROJECTS.create,
    PROJECTS.edit,
    SOLUTIONS.view,
    SOLUTIONS.create,
    SOLUTIONS.edit,
    INDUSTRIES.view,
    INDUSTRIES.create,
    INDUSTRIES.edit,
    TEAM.view,
    TEAM.create,
    TEAM.edit,
    LEADS.view,
    LEADS.edit,
    PAGES.view,
    PAGES.create,
    PAGES.edit,
    MEDIA.view,
    MEDIA.upload,
    NAVIGATION.manage,
  ],

  Marketing: [
    PROJECTS.view,
    PROJECTS.create,
    PROJECTS.edit,
    SOLUTIONS.view,
    SOLUTIONS.create,
    SOLUTIONS.edit,
    INDUSTRIES.view,
    TEAM.view,
    LEADS.view,
    LEADS.edit,
    LEADS.assign,
    PAGES.view,
    PAGES.create,
    PAGES.edit,
    MEDIA.view,
    MEDIA.upload,
    SEO.manage,
  ],

  Sales: [
    PROJECTS.view,
    SOLUTIONS.view,
    INDUSTRIES.view,
    TEAM.view,
    LEADS.view,
    LEADS.edit,
    LEADS.assign,
    PAGES.view,
  ],

  Viewer: [
    PROJECTS.view,
    SOLUTIONS.view,
    INDUSTRIES.view,
    TEAM.view,
    LEADS.view,
    PAGES.view,
    MEDIA.view,
  ],
} as const;

// ── Helper ─────────────────────────────────────────────────────────

/**
 * Get permission strings for a given role name.
 * Returns an empty array if the role is not recognized.
 */
export function getPermissionsForRole(roleName: string): readonly Permission[] {
  return ROLE_PERMISSIONS[roleName] ?? [];
}
