import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if user has profile data, if not create from metadata
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (!profile && data.user.user_metadata) {
        // Create profile with sign-up metadata
        await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email,
          display_name:
            data.user.user_metadata.display_name ||
            data.user.user_metadata.full_name ||
            "User",
          phone: data.user.user_metadata.phone || "",
          created_at: new Date().toISOString(),
        });
      }

      // Redirect to home page after successful OAuth
      return NextResponse.redirect(`${origin}/home`);
    }
  }

  // Fallback redirect to home page
  return NextResponse.redirect(`${origin}/`);
}
