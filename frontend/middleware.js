/**
 * middleware.js
 * Next.js Edge Middleware — runs before every matched request.
 *
 * Protection rules:
 *   /admin*  →  must have a valid NextAuth session token
 *               no token → redirect to /admin (login page)
 *               has token but isAdmin=false → redirect to /
 *               has token + isAdmin=true → allow
 *
 * NOTE: The middleware only checks the JWT token structure.
 * The full isAdmin() verification happens inside each page/API route too
 * (defence in depth). This prevents URL-bar bypass and unauthorised scraping.
 */

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Routes protected by this middleware
const ADMIN_PREFIX = "/admin";

// The login page itself must be reachable without a session
const LOGIN_PAGE = "/admin";

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Only intercept /admin routes
    if (!pathname.startsWith(ADMIN_PREFIX)) {
        return NextResponse.next();
    }

    // Allow the login page itself so we don't infinite-loop
    // /admin (exact) is the login page — allow unauthenticated GET
    // /admin/... sub-routes are dashboard pages — require session
    const isSubRoute = pathname !== LOGIN_PAGE && pathname.startsWith(ADMIN_PREFIX + "/");

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // ── Case 1: No session at all ──────────────────────────────────────────
    if (!token) {
        // If hitting a sub-route without session, redirect to login
        if (isSubRoute) {
            const loginUrl = new URL(LOGIN_PAGE, request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
        // /admin itself without session = show login page, allow through
        return NextResponse.next();
    }

    // ── Case 2: Has session but not admin ─────────────────────────────────
    // token.isAdmin is set by the session callback in lib/auth.js
    // We re-derive it here from the raw token fields for edge compatibility
    const adminEmail = process.env.ADMIN_EMAIL ?? "";
    const adminGoogleId = process.env.ADMIN_GOOGLE_ID ?? "";

    const emailMatch = token.email?.toLowerCase().trim() === adminEmail.toLowerCase().trim();
    const googleIdMatch = adminGoogleId
        ? String(token.googleId ?? "") === String(adminGoogleId)
        : true;

    const tokenIsAdmin = Boolean(adminEmail && emailMatch && googleIdMatch);

    if (!tokenIsAdmin) {
        // Logged in with Google but not the admin account → bounce to homepage
        return NextResponse.redirect(new URL("/", request.url));
    }

    // ── Case 3: Verified admin — allow through ────────────────────────────
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all /admin routes.
         * Exclude Next.js internals and static assets to avoid overhead.
         */
        "/admin",
        "/admin/:path*",
    ],
};
