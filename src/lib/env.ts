function getEnvVar(name: string, fallback = ""): string {
  const value = process.env[name];
  return value || fallback;
}

export const env = {
  NEXT_PUBLIC_SUPABASE_URL: getEnvVar("NEXT_PUBLIC_SUPABASE_URL", "https://mntubwnrirsybpnfdsco.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", "sb_publishable_GDiFw8VD4DX13_XD75Hy_A_PAFSsVwK"),
  SITE_URL: getEnvVar("NEXT_PUBLIC_SITE_URL", "https://bytebuildit.com"),
} as const;

export type Env = typeof env;
