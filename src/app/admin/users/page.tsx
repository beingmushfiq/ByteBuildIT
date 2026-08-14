"use client";

import { useState, useCallback, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

// ── Types ─────────────────────────────────────────────────────────

interface UserRow {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  org_id: string;
  role_id: string;
  department_id: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  roles?: { id: string; name: string } | null;
  departments?: { id: string; name: string } | null;
}

interface RoleRow {
  id: string;
  name: string;
}

interface DepartmentRow {
  id: string;
  name: string;
}

// ── Styles ────────────────────────────────────────────────────────

const INPUT_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--text-sm)",
  color: "var(--color-light)",
  backgroundColor: "var(--color-dark)",
  border: "1px solid var(--color-gray-700)",
  borderRadius: "var(--radius-md)",
  padding: "8px 12px",
  outline: "none",
  width: "100%",
  transition: "border-color 150ms",
};

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
  fontWeight: 500,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--color-muted)",
  display: "block",
  marginBottom: "6px",
};

const OVERLAY_STYLE: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 300,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  backdropFilter: "blur(4px)",
};

const MODAL_STYLE: React.CSSProperties = {
  backgroundColor: "var(--color-deep-navy)",
  border: "1px solid var(--color-gray-700)",
  borderRadius: "var(--radius-lg)",
  width: "100%",
  maxWidth: 480,
  maxHeight: "90vh",
  overflow: "auto",
};

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Super Admin": { bg: "rgba(239, 68, 68, 0.12)", text: "#F87171", border: "rgba(239, 68, 68, 0.3)" },
  Admin: { bg: "rgba(139, 92, 246, 0.12)", text: "#A78BFA", border: "rgba(139, 92, 246, 0.3)" },
  Editor: { bg: "rgba(46, 74, 249, 0.12)", text: "#4A62FF", border: "rgba(46, 74, 249, 0.3)" },
  "Content Manager": { bg: "rgba(34, 197, 94, 0.12)", text: "#4ADE80", border: "rgba(34, 197, 94, 0.3)" },
  Marketing: { bg: "rgba(245, 158, 11, 0.12)", text: "#FBBF24", border: "rgba(245, 158, 11, 0.3)" },
  Sales: { bg: "rgba(59, 130, 246, 0.12)", text: "#60A5FA", border: "rgba(59, 130, 246, 0.3)" },
  Viewer: { bg: "rgba(133, 141, 154, 0.12)", text: "#858D9A", border: "rgba(133, 141, 154, 0.3)" },
};

// ── Component ─────────────────────────────────────────────────────

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [departments, setDepartments] = useState<DepartmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRoleId, setFormRoleId] = useState("");
  const [formDepartmentId, setFormDepartmentId] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formPassword, setFormPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (loading) return;
    try {
      const supabase = createClient();

      const [usersResult, rolesResult, deptResult] = await Promise.all([
        supabase
          .from("users")
          .select(`
            id, email, name, avatar_url, org_id, role_id, department_id,
            is_active, last_login_at, created_at,
            roles (id, name),
            departments (id, name)
          `)
          .order("name"),
        supabase.from("roles").select("id, name").order("name"),
        supabase.from("departments").select("id, name").order("name"),
      ]);

      if (usersResult.data) setUsers(usersResult.data as unknown as UserRow[]);
      if (rolesResult.data) setRoles(rolesResult.data as RoleRow[]);
      if (deptResult.data) setDepartments(deptResult.data as DepartmentRow[]);
    } catch {
      // Silently fail
    }
    setLoading(false);
  }, [loading]);

  if (loading) {
    loadData();
  }

  function openCreateModal() {
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormRoleId(roles[0]?.id ?? "");
    setFormDepartmentId("");
    setFormIsActive(true);
    setFormPassword("");
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(user: UserRow) {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRoleId(user.role_id);
    setFormDepartmentId(user.department_id ?? "");
    setFormIsActive(user.is_active);
    setFormPassword("");
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);

    try {
      const supabase = createClient();

      if (editingUser) {
        // Update existing user
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from("users") as any)
          .update({
            name: formName,
            email: formEmail,
            role_id: formRoleId,
            department_id: formDepartmentId || null,
            is_active: formIsActive,
          })
          .eq("id", editingUser.id);

        if (error) {
          setFormError(error.message);
          return;
        }
      } else {
        // Create new user via Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formEmail,
          password: formPassword,
          options: { data: { name: formName } },
        });

        if (authError) {
          setFormError(authError.message);
          return;
        }

        if (authData.user) {
          // Get the user's org_id from the current session
          const { data: currentUser } = await supabase.auth.getUser();
          let orgId = "";

          if (currentUser.user) {
            const { data: profile } = await supabase
              .from("users")
              .select("org_id")
              .eq("id", currentUser.user.id)
              .single();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            orgId = (profile as any)?.org_id ?? "";
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error: insertError } = await (supabase.from("users") as any).insert({
            id: authData.user.id,
            email: formEmail,
            name: formName,
            org_id: orgId,
            role_id: formRoleId,
            department_id: formDepartmentId || null,
            is_active: formIsActive,
          });

          if (insertError) {
            setFormError(insertError.message);
            return;
          }
        }
      }

      setModalOpen(false);
      await loadData();
    } catch {
      setFormError("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-2xl)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--color-light)",
            }}
          >
            Users
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              color: "var(--color-muted)",
              marginTop: "var(--space-1)",
            }}
          >
            Manage team members and their roles
          </p>
        </div>
        <button
          onClick={openCreateModal}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--color-white)",
            backgroundColor: "var(--color-accent)",
            border: "none",
            borderRadius: "var(--radius-md)",
            padding: "8px 16px",
            cursor: "pointer",
            transition: "background-color 150ms",
          }}
        >
          + Add User
        </button>
      </div>

      {/* Table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          backgroundColor: "var(--color-deep-navy)",
          border: "1px solid var(--color-gray-700)",
        }}
      >
        {loading ? (
          <div style={{ padding: "var(--space-8)", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
              Loading...
            </p>
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: "var(--space-8)", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
              No users found. Add your first team member.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-gray-700)" }}>
                  {["Name", "Email", "Role", "Department", "Status", "Last Login"].map(
                    (header) => (
                      <th
                        key={header}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "11px",
                          fontWeight: 500,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "var(--color-muted)",
                          textAlign: "left",
                          padding: "12px 16px",
                        }}
                      >
                        {header}
                      </th>
                    )
                  )}
                  <th style={{ width: 60 }} />
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const roleName =
                    typeof user.roles === "object" && user.roles
                      ? user.roles.name
                      : "";
                  const deptName =
                    typeof user.departments === "object" && user.departments
                      ? user.departments.name
                      : "—";
                  const roleColors = ROLE_COLORS[roleName] ?? ROLE_COLORS.Viewer;

                  return (
                    <tr
                      key={user.id}
                      style={{ borderBottom: "1px solid var(--color-gray-700)" }}
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <div className="flex items-center gap-3">
                          <div
                            className="flex items-center justify-center flex-shrink-0"
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "var(--radius-full)",
                              backgroundColor: "var(--color-accent-dim)",
                              color: "var(--color-accent)",
                              fontFamily: "var(--font-mono)",
                              fontSize: "var(--text-xs)",
                              fontWeight: 600,
                            }}
                          >
                            {user.name?.charAt(0)?.toUpperCase() ?? "?"}
                          </div>
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "var(--text-sm)",
                              fontWeight: 500,
                              color: "var(--color-light)",
                            }}
                          >
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontFamily: "var(--font-mono)",
                          fontSize: "var(--text-xs)",
                          color: "var(--color-muted)",
                        }}
                      >
                        {user.email}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "10px",
                            fontWeight: 500,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            color: roleColors.text,
                            backgroundColor: roleColors.bg,
                            border: `1px solid ${roleColors.border}`,
                            borderRadius: "var(--radius-full)",
                            padding: "2px 8px",
                          }}
                        >
                          {roleName || "Unknown"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontFamily: "var(--font-body)",
                          fontSize: "var(--text-sm)",
                          color: "var(--color-muted)",
                        }}
                      >
                        {deptName}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "10px",
                            fontWeight: 500,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            color: user.is_active ? "#4ADE80" : "#F87171",
                            backgroundColor: user.is_active
                              ? "rgba(34, 197, 94, 0.12)"
                              : "rgba(239, 68, 68, 0.12)",
                            border: `1px solid ${user.is_active ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                            borderRadius: "var(--radius-full)",
                            padding: "2px 8px",
                          }}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontFamily: "var(--font-mono)",
                          fontSize: "11px",
                          color: "var(--color-gray-500)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDate(user.last_login_at)}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          onClick={() => openEditModal(user)}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "11px",
                            color: "var(--color-muted)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px 8px",
                            borderRadius: "var(--radius-md)",
                            transition: "color 150ms, background-color 150ms",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "var(--color-light)";
                            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "var(--color-muted)";
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={OVERLAY_STYLE} onClick={() => setModalOpen(false)}>
          <div style={MODAL_STYLE} onClick={(e) => e.stopPropagation()}>
            <div
              className="flex items-center justify-between"
              style={{
                padding: "var(--space-5)",
                borderBottom: "1px solid var(--color-gray-700)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-base)",
                  fontWeight: 600,
                  color: "var(--color-light)",
                }}
              >
                {editingUser ? "Edit User" : "Add User"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-muted)",
                  cursor: "pointer",
                  padding: "4px",
                  lineHeight: 1,
                  fontSize: "18px",
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: "var(--space-5)" }}>
              {formError && (
                <div
                  className="mb-4 rounded"
                  style={{
                    padding: "10px 14px",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    color: "#F87171",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                  }}
                >
                  {formError}
                </div>
              )}

              <div className="mb-4">
                <label style={LABEL_STYLE}>Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  style={INPUT_STYLE}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
                />
              </div>

              <div className="mb-4">
                <label style={LABEL_STYLE}>Email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                  disabled={!!editingUser}
                  style={{
                    ...INPUT_STYLE,
                    opacity: editingUser ? 0.6 : 1,
                    cursor: editingUser ? "not-allowed" : "text",
                  }}
                  onFocus={(e) => { if (!editingUser) e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
                />
              </div>

              {!editingUser && (
                <div className="mb-4">
                  <label style={LABEL_STYLE}>Password</label>
                  <input
                    type="password"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    required
                    minLength={8}
                    style={INPUT_STYLE}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
                  />
                </div>
              )}

              <div className="mb-4">
                <label style={LABEL_STYLE}>Role</label>
                <select
                  value={formRoleId}
                  onChange={(e) => setFormRoleId(e.target.value)}
                  required
                  style={{
                    ...INPUT_STYLE,
                    cursor: "pointer",
                    appearance: "none" as const,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23858D9A' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    paddingRight: "32px",
                  }}
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label style={LABEL_STYLE}>Department</label>
                <select
                  value={formDepartmentId}
                  onChange={(e) => setFormDepartmentId(e.target.value)}
                  style={{
                    ...INPUT_STYLE,
                    cursor: "pointer",
                    appearance: "none" as const,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23858D9A' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    paddingRight: "32px",
                  }}
                >
                  <option value="">None</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {editingUser && (
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-sm)",
                        fontWeight: 500,
                        color: "var(--color-light)",
                      }}
                    >
                      Active
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormIsActive(!formIsActive)}
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: formIsActive
                        ? "var(--color-accent)"
                        : "var(--color-gray-600)",
                      border: "none",
                      padding: 2,
                      cursor: "pointer",
                      position: "relative",
                      transition: "background-color 200ms",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        backgroundColor: "white",
                        position: "absolute",
                        top: 2,
                        left: formIsActive ? 22 : 2,
                        transition: "left 200ms",
                      }}
                    />
                  </button>
                </div>
              )}

              <div
                className="flex items-center justify-end gap-3"
                style={{ marginTop: "var(--space-5)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-gray-700)" }}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "var(--color-muted)",
                    backgroundColor: "transparent",
                    border: "1px solid var(--color-gray-700)",
                    borderRadius: "var(--radius-md)",
                    padding: "8px 16px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "var(--color-white)",
                    backgroundColor: "var(--color-accent)",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    padding: "8px 20px",
                    cursor: saving ? "not-allowed" : "pointer",
                    opacity: saving ? 0.6 : 1,
                    transition: "background-color 150ms",
                  }}
                >
                  {saving ? "Saving..." : editingUser ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
