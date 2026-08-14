import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import type { Database } from "./types";

export async function createClient() {
  const cookieStore = await cookies();

  return createSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        storage: {
          isServer: true,
          getItem(name: string) {
            const cookie = cookieStore.get(name);
            return Promise.resolve(cookie?.value ?? null);
          },
          setItem(name: string, value: string) {
            cookieStore.set(name, value, {
              httpOnly: true,
              secure: true,
              sameSite: "lax",
              path: "/",
            });
            return Promise.resolve();
          },
          removeItem(name: string) {
            cookieStore.delete(name);
            return Promise.resolve();
          },
        },
      },
    }
  );
}
