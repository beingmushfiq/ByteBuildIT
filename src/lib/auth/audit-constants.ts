// Audit action constants — safe for both server and client use

export const AUDIT_ACTIONS = {
  // User lifecycle
  USER_CREATED: "user.created",
  USER_UPDATED: "user.updated",
  USER_ACTIVATED: "user.activated",
  USER_DEACTIVATED: "user.deactivated",
  USER_DELETED: "user.deleted",
  USER_SIGNED_IN: "user.signed_in",

  // Projects
  PROJECT_CREATED: "project.created",
  PROJECT_UPDATED: "project.updated",
  PROJECT_PUBLISHED: "project.published",
  PROJECT_UNPUBLISHED: "project.unpublished",
  PROJECT_DELETED: "project.deleted",

  // Solutions
  SOLUTION_CREATED: "solution.created",
  SOLUTION_UPDATED: "solution.updated",
  SOLUTION_PUBLISHED: "solution.published",
  SOLUTION_DELETED: "solution.deleted",

  // Industries
  INDUSTRY_CREATED: "industry.created",
  INDUSTRY_UPDATED: "industry.updated",
  INDUSTRY_DELETED: "industry.deleted",

  // Pages
  PAGE_CREATED: "page.created",
  PAGE_UPDATED: "page.updated",
  PAGE_PUBLISHED: "page.published",
  PAGE_DELETED: "page.deleted",

  // Leads
  LEAD_CREATED: "lead.created",
  LEAD_UPDATED: "lead.updated",
  LEAD_STATUS_CHANGED: "lead.status_changed",
  LEAD_ASSIGNED: "lead.assigned",
  LEAD_DELETED: "lead.deleted",

  // Media
  MEDIA_UPLOADED: "media.uploaded",
  MEDIA_DELETED: "media.deleted",

  // Settings
  SETTINGS_UPDATED: "settings.updated",

  // Navigation
  NAVIGATION_UPDATED: "navigation.updated",

  // Roles & Permissions
  ROLE_CREATED: "role.created",
  ROLE_UPDATED: "role.updated",
  ROLE_DELETED: "role.deleted",
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];
