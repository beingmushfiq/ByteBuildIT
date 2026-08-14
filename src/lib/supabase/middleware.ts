import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Refreshes the Supabase auth session and updates cookies.
 *
 * Use this inside your proxy.ts (Next.js 16 replaces middleware.ts with proxy.ts).
 *
 * @example
 * ```ts
 * // src/proxy.ts
 * import { updateSession } from "@/lib/supabase/middleware";
 * import type { NextRequest } from "next/server";
 *
 * export async function proxy(request: NextRequest) {
 *   return await updateSession(request);
 * }
 *
 * export const config = {
 *   matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
 * };
 * ```
 */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        storage: {
          isServer: true,
          getItem(name: string) {
            return Promise.resolve(request.cookies.get(name)?.value ?? null);
          },
          setItem(name: string, value: string) {
            response.cookies.set(name, value, {
              httpOnly: true,
              secure: true,
              sameSite: "lax",
              path: "/",
            });
            return Promise.resolve();
          },
          removeItem(name: string) {
            response.cookies.delete(name);
            return Promise.resolve();
          },
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}
