/**
 * lib/auth.js
 * Central auth helpers — single source of truth for admin identity.
 * Used by: NextAuth config, middleware, admin page, API routes.
 *
 * NEVER expose ADMIN_GOOGLE_ID or GOOGLE_CLIENT_SECRET to the client.
 * All server-side only checks use process.env directly.
 */

import GoogleProvider from "next-auth/providers/google";

// ── Admin identity ──────────────────────────────────────────────────────────
// These are SERVER-SIDE only (no NEXT_PUBLIC_ prefix).
// Verified at runtime — not bundled into client JS.
const getAdminEmail = () => {
    const email = process.env.ADMIN_EMAIL;
    if (!email) {
        console.warn("[auth] ADMIN_EMAIL is not set. Admin access will be denied for everyone.");
    }
    return email ?? null;
};

const getAdminGoogleId = () => process.env.ADMIN_GOOGLE_ID ?? null;

/**
 * isAdmin({ email, googleId })
 * Returns true only if BOTH conditions pass:
 *   1. email matches ADMIN_EMAIL (required)
 *   2. if ADMIN_GOOGLE_ID is set, googleId must also match (optional extra factor)
 *
 * This is the single authoritative check used everywhere.
 */
export function isAdmin({ email, googleId } = {}) {
    const adminEmail = getAdminEmail();
    const adminGoogleId = getAdminGoogleId();

    if (!adminEmail) return false;
    if (!email) return false;

    const emailMatch = email.toLowerCase().trim() === adminEmail.toLowerCase().trim();
    if (!emailMatch) return false;

    // If ADMIN_GOOGLE_ID is configured, it must also match
    if (adminGoogleId) {
        if (!googleId) return false;
        return String(googleId) === String(adminGoogleId);
    }

    return true;
}

// ── NextAuth options ────────────────────────────────────────────────────────
export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            // Prevent account linking exploits
            allowDangerousEmailAccountLinking: false,
        }),
    ],

    pages: {
        signIn: "/admin",
        error: "/admin",
    },

    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days (reduced from 30 for security)
    },

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        /**
         * signIn — hard gate at OAuth level.
         * Blocked accounts never get a session token.
         */
        async signIn({ user, account }) {
            // Only Google OAuth is accepted
            if (account?.provider !== "google") return false;

            const googleId = account?.providerAccountId ?? null;

            if (!isAdmin({ email: user.email, googleId })) {
                // Log attempt server-side (not exposed to client)
                console.warn(`[auth] Blocked sign-in attempt: ${user.email}`);
                return false;
            }

            return true;
        },

        /**
         * jwt — embed minimal identity into token.
         * googleId stored for downstream isAdmin checks.
         */
        async jwt({ token, user, account }) {
            if (user) token.email = user.email;
            if (account) token.googleId = account.providerAccountId ?? null;
            return token;
        },

        /**
         * session — expose only what the client needs.
         * googleId is intentionally NOT exposed to client.
         */
        async session({ session, token }) {
            if (session.user) {
                session.user.email = token.email ?? null;
                // isAdmin flag computed server-side, safe to expose as boolean
                session.user.isAdmin = isAdmin({
                    email: token.email,
                    googleId: token.googleId,
                });
            }
            return session;
        },
    },
};
