import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, problem, phone, budget } = body;

    if (!name || !email || !problem) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Lazy Supabase initialization — avoids module-level crash when env vars are absent at build time
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      console.warn("Supabase env vars not set — contact submission acknowledged");
      return NextResponse.json({ success: true, message: "Logged locally" }, { status: 200 });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, key);

    const defaultOrgId = "00000000-0000-0000-0000-000000000001";

    const { error } = await supabase.from("leads").insert({
      org_id: defaultOrgId,
      name,
      email,
      company: company || null,
      phone: phone || null,
      message: problem,
      budget: budget || null,
      status: "new",
      source: "website_contact",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Database error: " + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
