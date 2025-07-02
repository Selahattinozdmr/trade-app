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
      // Redirect to user's profile page after successful OAuth
      return NextResponse.redirect(`${origin}/profile/${data.user.id}`);
    }
  }

  // Fallback redirect to home page
  return NextResponse.redirect(`${origin}/`);
}
