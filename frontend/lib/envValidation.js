/**
 * lib/envValidation.js
 * Server-side environment variable validation.
 * Import this in any server component or API route to catch misconfigurations early.
 *
 * TASK 9 — Environment Audit Report (inline)
 *
 * Variable               | Side   | Safe? | Notes
 * ─────────────────────────────────────────────────────────────────────────
 * NEXT_PUBLIC_API_BASE_URL   | Client | ✅    | Backend URL, public is fine
 * NEXT_PUBLIC_SUPABASE_URL   | Client | ✅    | Supabase project URL, public is fine
 * NEXT_PUBLIC_SUPABASE_ANON_KEY | Client | ⚠️  | Anon key is public by design in Supabase,
 *                                               but RLS must be configured correctly
 * SUPABASE_SERVICE_ROLE_KEY  | Server | 🔴    | NEVER expose. Server-side only.
 * GOOGLE_CLIENT_ID           | Server | ✅    | Used only in NextAuth server config
 * GOOGLE_CLIENT_SECRET       | Server | 🔴    | NEVER expose. Server-side only.
 * NEXTAUTH_SECRET            | Server | 🔴    | NEVER expose. Server-side only.
 * NEXTAUTH_URL               | Server | ✅    | Can be public
 * ADMIN_EMAIL                | Server | 🔴    | NEVER expose. No NEXT_PUBLIC_ prefix.
 * ADMIN_GOOGLE_ID            | Server | 🔴    | NEVER expose. No NEXT_PUBLIC_ prefix.
 */

const REQUIRED_SERVER_VARS = [
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "ADMIN_EMAIL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
];

const REQUIRED_PUBLIC_VARS = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

const SECURITY_VARS = [
    "ADMIN_GOOGLE_ID",
    "SUPABASE_SERVICE_ROLE_KEY",
];

/**
 * validateEnv()
 * Call once at server startup or in layout.js server component.
 * Logs warnings for missing vars. Never throws — graceful degradation.
 */
export function validateEnv() {
    // Only run server-side
    if (typeof window !== "undefined") return;

    const missing = [];
    const warnings = [];

    for (const key of REQUIRED_SERVER_VARS) {
        if (!process.env[key] || process.env[key].includes("your_")) {
            missing.push(key);
        }
    }

    for (const key of REQUIRED_PUBLIC_VARS) {
        if (!process.env[key]) {
            missing.push(key);
        }
    }

    // Check for accidental NEXT_PUBLIC_ on secret vars
    const secretLeakRisk = [
        "NEXT_PUBLIC_GOOGLE_CLIENT_SECRET",
        "NEXT_PUBLIC_NEXTAUTH_SECRET",
        "NEXT_PUBLIC_ADMIN_EMAIL",
        "NEXT_PUBLIC_ADMIN_GOOGLE_ID",
        "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY",
    ];

    for (const key of secretLeakRisk) {
        if (process.env[key]) {
            warnings.push(`⚠️  SECURITY RISK: ${key} should NEVER have NEXT_PUBLIC_ prefix — it will leak to the browser!`);
        }
    }

    if (missing.length > 0) {
        console.warn("[env] Missing or placeholder environment variables:", missing.join(", "));
    }

    for (const w of warnings) {
        console.error("[env]", w);
    }

    if (process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL !== "ragahbuana@gmail.com") {
        console.info("[env] ADMIN_EMAIL is configured.");
    }

    if (!process.env.ADMIN_GOOGLE_ID) {
        console.info("[env] ADMIN_GOOGLE_ID is not set — email-only admin check active. Consider setting this for extra security.");
    }
}
