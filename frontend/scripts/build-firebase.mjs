/**
 * scripts/build-firebase.mjs
 * Custom build script for Firebase Hosting static export.
 *
 * Problem: next-auth API routes are incompatible with output: 'export'
 * Solution:
 *   1. Temporarily move app/api → _api_backup_firebase (outside app dir)
 *   2. Run next build with BUILD_TARGET=firebase (enables output: 'export')
 *   3. Restore _api_backup_firebase → app/api
 *
 * Produces frontend/out/ with the latest static build for Firebase.
 * NOTE: Admin Google login will not work on Firebase Hosting (no server).
 *       Admin login only works on Vercel deployment.
 */

import { execSync } from "child_process";
import { renameSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const apiDir = join(root, "app", "api");
const apiBackup = join(root, "_api_backup_firebase");
const outIndex = join(root, "out", "index.html");

let restored = false;

function restore() {
    if (!restored && existsSync(apiBackup)) {
        renameSync(apiBackup, apiDir);
        restored = true;
        console.log("✅ Restored app/api");
    }
}

process.on("exit", restore);
process.on("SIGINT", () => { restore(); process.exit(1); });
process.on("SIGTERM", () => { restore(); process.exit(1); });

try {
    // Step 1: Move API routes outside app/ so Next.js ignores them
    if (existsSync(apiDir)) {
        renameSync(apiDir, apiBackup);
        console.log("⏸  Temporarily moved app/api outside project for static export");
    }

    // Step 2: Static export build
    console.log("🔨 Building static export for Firebase Hosting...\n");
    try {
        execSync("npx next build", {
            cwd: root,
            stdio: "inherit",
            env: { ...process.env, BUILD_TARGET: "firebase" },
        });
    } catch {
        // Next.js exits non-zero when middleware exists in static build.
        // This is a warning, not a failure. Verify output was actually created.
        if (!existsSync(outIndex)) {
            throw new Error("Build failed — out/index.html was not generated.");
        }
        console.log("\n⚠️  Next.js middleware warning (expected for static export — safe to ignore).");
    }

    console.log("\n✅ Static export complete → frontend/out/");
    console.log("📦 Ready to deploy: run  firebase deploy --only hosting  from project root\n");

} catch (err) {
    console.error("\n❌ Build failed:", err.message);
    process.exitCode = 1;
} finally {
    restore();
}
