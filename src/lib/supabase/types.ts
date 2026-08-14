export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  organization_id: string;
  department_id: string | null;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string | null;
  created_at: string;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  organization_id: string | null;
  role_id: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role_id: string | null;
  joined_at: string;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  organization_id: string;
  title: string;
  slug: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  published_at: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PageSection {
  id: string;
  page_id: string;
  title: string;
  slug: string;
  content: string | null;
  sort_order: number;
  section_type: string;
  is_visible: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  organization_id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  thumbnail_url: string | null;
  live_url: string | null;
  repo_url: string | null;
  industry_id: string | null;
  service_id: string | null;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  completed_at: string | null;
  technologies: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Solution {
  id: string;
  organization_id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  icon_name: string | null;
  features: string[] | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Industry {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_name: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  description: string | null;
  content: string | null;
  icon_name: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  organization_id: string;
  filename: string;
  original_url: string;
  file_size: number | null;
  mime_type: string | null;
  alt_text: string | null;
  caption: string | null;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  id: string;
  organization_id: string;
  label: string;
  href: string;
  parent_id: string | null;
  sort_order: number;
  is_external: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: string;
  organization_id: string;
  key: string;
  value: string | null;
  type: "string" | "number" | "boolean" | "json";
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Redirect {
  id: string;
  organization_id: string;
  source_path: string;
  target_path: string;
  status_code: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  organization_id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  message: string | null;
  source: string | null;
  status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost" | "archived";
  assigned_to: string | null;
  budget_range: string | null;
  project_type: string | null;
  timeline: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  author_id: string | null;
  content: string;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeadStatusHistory {
  id: string;
  lead_id: string;
  from_status: Lead["status"] | null;
  to_status: Lead["status"];
  changed_by: string | null;
  note: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  organization_id: string | null;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// ── Relationship types ──────────────────────────────────────────────

export type OrganizationWithMembers = Organization & {
  users: Pick<User, "id" | "full_name" | "email" | "avatar_url">[];
  teams: Team[];
};

export type DepartmentWithTeam = Department & {
  teams: Team[];
  parent: Department | null;
};

export type TeamWithMembers = Team & {
  members: (TeamMember & {
    user: Pick<User, "id" | "full_name" | "email" | "avatar_url">;
    role: Role | null;
  })[];
  department: Department | null;
};

export type RoleWithPermissions = Role & {
  permissions: Permission[];
};

export type UserWithOrganization = User & {
  organization: Organization | null;
  role: (Role & { permissions: Permission[] }) | null;
};

export type PageWithSections = Page & {
  sections: PageSection[];
  author: Pick<User, "id" | "full_name" | "avatar_url"> | null;
};

export type ProjectWithRelations = Project & {
  industry: Industry | null;
  service: Service | null;
  media: Media[];
};

export type LeadWithDetails = Lead & {
  notes: (LeadNote & {
    author: Pick<User, "id" | "full_name" | "avatar_url"> | null;
  })[];
  status_history: LeadStatusHistory[];
  assigned_user: Pick<User, "id" | "full_name" | "avatar_url"> | null;
};

export type NavigationItemWithChildren = NavigationItem & {
  children: NavigationItemWithChildren[];
};

// ── Supabase Database types ─────────────────────────────────────────

type TableEntry<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: {
    foreignKeyName: string;
    columns: string[];
    isOneToOne?: boolean;
    referencedRelation: string;
    referencedColumns: string[];
  }[];
};

export type Database = {
  public: {
    Tables: {
      organizations: TableEntry<Organization, Partial<Organization> & Pick<Organization, "name" | "slug">, Partial<Omit<Organization, "id" | "created_at">>>;
      departments: TableEntry<Department, Partial<Department> & Pick<Department, "organization_id" | "name">, Partial<Omit<Department, "id" | "created_at">>>;
      teams: TableEntry<Team, Partial<Team> & Pick<Team, "organization_id" | "name">, Partial<Omit<Team, "id" | "created_at">>>;
      roles: TableEntry<Role, Partial<Role> & Pick<Role, "organization_id" | "name">, Partial<Omit<Role, "id" | "created_at">>>;
      permissions: TableEntry<Permission, Partial<Permission> & Pick<Permission, "name" | "resource" | "action">, Partial<Omit<Permission, "id" | "created_at">>>;
      role_permissions: TableEntry<RolePermission, Pick<RolePermission, "role_id" | "permission_id">, Partial<Omit<RolePermission, "role_id" | "permission_id">>>;
      users: TableEntry<User, Partial<User> & Pick<User, "id" | "email">, Partial<Omit<User, "id" | "created_at">>>;
      team_members: TableEntry<TeamMember, Partial<TeamMember> & Pick<TeamMember, "team_id" | "user_id">, Partial<Omit<TeamMember, "id" | "created_at">>>;
      pages: TableEntry<Page, Partial<Page> & Pick<Page, "organization_id" | "title" | "slug">, Partial<Omit<Page, "id" | "created_at">>>;
      page_sections: TableEntry<PageSection, Partial<PageSection> & Pick<PageSection, "page_id" | "title" | "slug">, Partial<Omit<PageSection, "id" | "created_at">>>;
      projects: TableEntry<Project, Partial<Project> & Pick<Project, "organization_id" | "title" | "slug">, Partial<Omit<Project, "id" | "created_at">>>;
      solutions: TableEntry<Solution, Partial<Solution> & Pick<Solution, "organization_id" | "title" | "slug">, Partial<Omit<Solution, "id" | "created_at">>>;
      industries: TableEntry<Industry, Partial<Industry> & Pick<Industry, "organization_id" | "name" | "slug">, Partial<Omit<Industry, "id" | "created_at">>>;
      services: TableEntry<Service, Partial<Service> & Pick<Service, "organization_id" | "name" | "slug">, Partial<Omit<Service, "id" | "created_at">>>;
      media: TableEntry<Media, Partial<Media> & Pick<Media, "organization_id" | "filename" | "original_url">, Partial<Omit<Media, "id" | "created_at">>>;
      navigation_items: TableEntry<NavigationItem, Partial<NavigationItem> & Pick<NavigationItem, "organization_id" | "label" | "href">, Partial<Omit<NavigationItem, "id" | "created_at">>>;
      settings: TableEntry<Setting, Partial<Setting> & Pick<Setting, "organization_id" | "key">, Partial<Omit<Setting, "id" | "created_at">>>;
      redirects: TableEntry<Redirect, Partial<Redirect> & Pick<Redirect, "organization_id" | "source_path" | "target_path">, Partial<Omit<Redirect, "id" | "created_at">>>;
      leads: TableEntry<Lead, Partial<Lead> & Pick<Lead, "organization_id" | "email">, Partial<Omit<Lead, "id" | "created_at">>>;
      lead_notes: TableEntry<LeadNote, Partial<LeadNote> & Pick<LeadNote, "lead_id" | "content">, Partial<Omit<LeadNote, "id" | "created_at">>>;
      lead_status_history: TableEntry<LeadStatusHistory, Partial<LeadStatusHistory> & Pick<LeadStatusHistory, "lead_id" | "to_status">, Partial<Omit<LeadStatusHistory, "id" | "created_at">>>;
      audit_logs: TableEntry<AuditLog, Partial<AuditLog> & Pick<AuditLog, "action" | "resource_type">, Partial<Omit<AuditLog, "id" | "created_at">>>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      lead_status: Lead["status"];
      setting_type: Setting["type"];
    };
    CompositeTypes: Record<string, never>;
  };
};
