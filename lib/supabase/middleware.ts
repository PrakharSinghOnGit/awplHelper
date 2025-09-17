import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Skip auth checks for public routes and static assets
  const publicPaths = [
    "/",
    "/auth",
    "/api",
    "/_next",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
  ];

  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isPublicPath && !request.nextUrl.pathname.startsWith("/protected")) {
    return supabaseResponse;
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
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

  // Check authentication for protected routes
  if (request.nextUrl.pathname.startsWith("/protected")) {
    try {
      // // Debug: Log all cookies being passed
      // const allCookies = request.cookies.getAll();
      // console.log("Middleware cookies:", allCookies);

      // Get session using Supabase client
      const {
        data: { session },
        // error,
      } = await supabase.auth.getSession();
      // console.log("Session check result:", {
      //   hasSession: !!session,
      //   error: error?.message,
      //   sessionExpiresAt: session?.expires_at,
      // });

      if (!session) {
        // No valid session found
        console.log("No valid session, redirecting to login");
        const redirectTo = request.nextUrl.pathname;
        const url = request.nextUrl.clone();
        url.pathname = "/auth/login";
        url.searchParams.set("redirectTo", redirectTo);

        // Create response with proper cookie handling
        const response = NextResponse.redirect(url);

        // Copy over any existing cookies to maintain state
        supabaseResponse.cookies.getAll().forEach((cookie) => {
          response.cookies.set(cookie.name, cookie.value);
        });

        return response;
      }
    } catch (err) {
      console.error("Auth check error:", err);
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
