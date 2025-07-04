import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Middleware: User check result:", {
    hasUser: !!user,
    userId: user?.id,
    path: request.nextUrl.pathname,
  });

  // Admin routes
  const adminPaths = [
    "/admin/dashboard",
    "/admin/test",
    "/admin/simple-dashboard",
  ];
  const isAdminPath = adminPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );
  const isAdminSignIn = request.nextUrl.pathname === "/admin/sign-in";

  // Check admin access for admin routes
  if (isAdminPath && user) {
    console.log("Middleware: Checking admin access for user:", user.id);
    console.log("Middleware: Requested path:", request.nextUrl.pathname);

    const { data: userRole, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("id", user.id)
      .single();

    console.log("Middleware: Role check result:", { userRole, roleError });

    if (
      !userRole?.role ||
      (userRole.role !== "admin" && userRole.role !== "super_admin")
    ) {
      console.log("Middleware: Access denied, redirecting to sign-in");
      const url = request.nextUrl.clone();
      url.pathname = "/admin/sign-in";
      return NextResponse.redirect(url);
    }

    console.log("Middleware: Admin access granted for:", userRole.role);
  }

  // Redirect unauthenticated users from admin routes to admin sign in
  if (isAdminPath && !user) {
    console.log("Middleware: No user found, redirecting to admin sign-in");
    const url = request.nextUrl.clone();
    url.pathname = "/admin/sign-in";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated admin users from admin sign in to admin dashboard
  if (isAdminSignIn && user) {
    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userRole?.role === "admin" || userRole?.role === "super_admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // Protected routes
  const protectedPaths = [
    "/home",
    "/profile",
    "/items/my",
    "/messages",
    "/settings",
  ];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Auth pages
  const authPaths = ["/sign-in", "/sign-up"];
  const isAuthPath = authPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Redirect unauthenticated users from protected routes to sign in
  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users from auth pages to home page
  if (isAuthPath && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  // Redirect root path to appropriate page
  if (request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = user ? "/home" : "/";
    if (user) {
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object instead of the supabaseResponse object

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
