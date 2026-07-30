-- ============================================================
-- SUPABASE RLS RECOMMENDATIONS
-- File ini HANYA rekomendasi. JANGAN dijalankan otomatis.
-- Jalankan manual di Supabase Dashboard → SQL Editor.
-- ============================================================

-- ── STEP 1: Enable RLS on both tables ──────────────────────
ALTER TABLE projects      ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates  ENABLE ROW LEVEL SECURITY;

-- ── STEP 2: Drop existing policies (clean slate) ───────────
DROP POLICY IF EXISTS "projects_public_read"        ON projects;
DROP POLICY IF EXISTS "projects_admin_insert"       ON projects;
DROP POLICY IF EXISTS "projects_admin_update"       ON projects;
DROP POLICY IF EXISTS "projects_admin_delete"       ON projects;

DROP POLICY IF EXISTS "certificates_public_read"    ON certificates;
DROP POLICY IF EXISTS "certificates_admin_insert"   ON certificates;
DROP POLICY IF EXISTS "certificates_admin_update"   ON certificates;
DROP POLICY IF EXISTS "certificates_admin_delete"   ON certificates;

-- ── STEP 3: PUBLIC READ (anon key allowed) ─────────────────
-- Anyone can read projects and certificates (portfolio is public)

CREATE POLICY "projects_public_read"
  ON projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "certificates_public_read"
  ON certificates
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ── STEP 4: ADMIN WRITE (authenticated only) ───────────────
-- Only authenticated users (your Google account via NextAuth + Supabase Auth)
-- can insert, update, delete.
-- Since this app uses NextAuth (not Supabase Auth directly),
-- the frontend relies on the anon key with RLS.
-- For stricter control, these policies restrict writes to authenticated role.
-- If you use service_role key server-side for writes, these are still correct.

CREATE POLICY "projects_admin_insert"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "projects_admin_update"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "projects_admin_delete"
  ON projects
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "certificates_admin_insert"
  ON certificates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "certificates_admin_update"
  ON certificates
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "certificates_admin_delete"
  ON certificates
  FOR DELETE
  TO authenticated
  USING (true);

-- ── STEP 5: Storage bucket policy for my-sertifikat ────────
-- Public read for certificate files (so they can be viewed)
-- Only authenticated users can upload/delete

-- Run in Supabase Dashboard → Storage → Policies → my-sertifikat bucket:
--
-- Policy name: "Public read certificate files"
-- Allowed operation: SELECT
-- Target roles: anon, authenticated
-- Policy definition: bucket_id = 'my-sertifikat'
--
-- Policy name: "Admin upload certificate files"
-- Allowed operation: INSERT
-- Target roles: authenticated
-- Policy definition: bucket_id = 'my-sertifikat'
--
-- Policy name: "Admin delete certificate files"
-- Allowed operation: DELETE
-- Target roles: authenticated
-- Policy definition: bucket_id = 'my-sertifikat'

-- ── NOTES ───────────────────────────────────────────────────
-- Current architecture uses NextAuth (not Supabase Auth).
-- The anon key is used for ALL Supabase operations from the frontend.
-- This means RLS cannot distinguish admin vs public at DB level
-- for the current setup — protection is enforced at app layer (middleware + isAdmin()).
--
-- To get true DB-level admin protection:
-- Option A: Implement Supabase Auth alongside NextAuth (complex)
-- Option B: Move all write operations to a server-side API route
--           that uses SUPABASE_SERVICE_ROLE_KEY (never expose to client)
--           This is the RECOMMENDED approach for production.
--
-- Example server-side write pattern:
-- app/api/admin/projects/route.js  → verifies session, uses service role key
-- app/api/admin/certificates/route.js → same pattern

-- ── RECOMMENDED: Server-side Supabase client (FUTURE) ──────
-- Create lib/supabaseAdmin.js (SERVER ONLY, never import in client components):
--
-- import { createClient } from "@supabase/supabase-js";
-- export const supabaseAdmin = createClient(
--   process.env.NEXT_PUBLIC_SUPABASE_URL,
--   process.env.SUPABASE_SERVICE_ROLE_KEY   // ← secret, never NEXT_PUBLIC_
-- );
