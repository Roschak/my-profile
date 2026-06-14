"use client";

/**
 * app/admin/page.jsx
 * Admin dashboard — protected by middleware AND client-side session check.
 * Defence in depth: even if middleware is bypassed, this page verifies
 * session.user.isAdmin before rendering any sensitive UI or making mutations.
 */

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabaseClient";

const ADMIN_PROJECTS_KEY = "ragah_admin_projects_v2";
const ADMIN_CERTIFICATES_KEY = "ragah_admin_certificates_v2";
const CERTIFICATE_BUCKET = "my-sertifikat";

// ── File upload security ────────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
const BLOCKED_EXTENSIONS = [".exe", ".bat", ".cmd", ".sh", ".php", ".js", ".mjs", ".ts", ".py", ".rb", ".pl"];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function validateUploadFile(file) {
  if (!file) return null;

  // Check size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File terlalu besar. Maksimal ${MAX_FILE_SIZE_MB}MB.`;
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return `Tipe file tidak diizinkan: ${file.type}. Hanya PDF dan gambar yang diterima.`;
  }

  // Check extension
  const ext = "." + file.name.split(".").pop().toLowerCase();
  if (BLOCKED_EXTENSIONS.includes(ext)) {
    return `Ekstensi file tidak diizinkan: ${ext}`;
  }

  return null; // valid
}

// ── Form defaults ───────────────────────────────────────────────────────────
const initialProjectForm = {
  name: "", text: "", type: "Project", tech: "", url: "", github: "", image: ""
};
const initialCertificateForm = {
  title: "", issuer: "", date: "", description: "",
  fileType: "pdf", fileUrl: "", verifyUrl: "", image: ""
};

const parseStorageJson = (value, fallback = []) => {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

// ── Component ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { data: session, status } = useSession();

  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [certificateForm, setCertificateForm] = useState(initialCertificateForm);
  const [certificateUpload, setCertificateUpload] = useState(null);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isLoading, setIsLoading] = useState(true);

  // ── Admin check ─────────────────────────────────────────────────────────
  // session.user.isAdmin is set server-side in lib/auth.js session callback
  const userIsAdmin = session?.user?.isAdmin === true;

  const sanitizeText = (value) => value.trim().replace(/[<>]/g, "");

  // ── Load data ────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      if (!session?.user || !userIsAdmin) {
        setIsLoading(false);
        return;
      }

      if (!isSupabaseConfigured || !supabase) {
        setProjects(parseStorageJson(localStorage.getItem(ADMIN_PROJECTS_KEY), []));
        setCertificates(parseStorageJson(localStorage.getItem(ADMIN_CERTIFICATES_KEY), []));
        setIsLoading(false);
        return;
      }

      const [{ data: projectRows }, { data: certRows }] = await Promise.all([
        supabase
          .from("projects")
          .select("id,name,description,project_type,tech,live_url,repo_url,image_url")
          .order("created_at", { ascending: false }),
        supabase
          .from("certificates")
          .select("id,title,issuer,issued_at,description,file_type,file_url,verify_url,cover_image_url")
          .order("created_at", { ascending: false }),
      ]);

      if (projectRows) {
        setProjects(projectRows.map((item) => ({
          id: item.id,
          name: item.name,
          text: item.description,
          type: item.project_type,
          tech: Array.isArray(item.tech) ? item.tech.join(", ") : "",
          url: item.live_url,
          github: item.repo_url,
          image: item.image_url,
        })));
      }

      if (certRows) {
        setCertificates(certRows.map((item) => ({
          id: item.id,
          title: item.title,
          issuer: item.issuer,
          date: item.issued_at,
          description: item.description,
          fileType: item.file_type || "pdf",
          fileUrl: item.file_url,
          verifyUrl: item.verify_url,
          image: item.cover_image_url,
        })));
      }

      setIsLoading(false);
    };

    load();
  }, [session?.user, userIsAdmin]);

  // ── Persist to localStorage when Supabase not available ─────────────────
  useEffect(() => {
    if (isSupabaseConfigured && supabase && session?.user) return;
    localStorage.setItem(ADMIN_PROJECTS_KEY, JSON.stringify(projects));
  }, [projects, session?.user]);

  useEffect(() => {
    if (isSupabaseConfigured && supabase && session?.user) return;
    localStorage.setItem(ADMIN_CERTIFICATES_KEY, JSON.stringify(certificates));
  }, [certificates, session?.user]);

  const projectCount = useMemo(() => projects.length, [projects]);
  const certificateCount = useMemo(() => certificates.length, [certificates]);

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    window.setTimeout(() => setMessage(""), 4000);
  };

  // ── Submit: project ──────────────────────────────────────────────────────
  const onSubmitProject = async (event) => {
    event.preventDefault();
    if (!userIsAdmin) return; // extra guard

    if (!projectForm.name.trim() || !projectForm.text.trim()) {
      showMessage("Project minimal wajib ada nama dan deskripsi.", "error");
      return;
    }

    const item = {
      id: crypto.randomUUID(),
      name: sanitizeText(projectForm.name),
      text: sanitizeText(projectForm.text),
      type: sanitizeText(projectForm.type) || "Project",
      tech: projectForm.tech.split(",").map((p) => sanitizeText(p)).filter(Boolean),
      url: sanitizeText(projectForm.url),
      github: sanitizeText(projectForm.github),
      image: sanitizeText(projectForm.image),
    };

    if (isSupabaseConfigured && supabase && session?.user) {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          name: item.name,
          description: item.text,
          project_type: item.type,
          tech: item.tech,
          live_url: item.url,
          repo_url: item.github,
          image_url: item.image,
        })
        .select("id")
        .single();

      if (error) { showMessage(`Gagal simpan: ${error.message}`, "error"); return; }
      item.id = data.id;
    }

    setProjects((prev) => [item, ...prev]);
    setProjectForm(initialProjectForm);
    showMessage("Project berhasil ditambahkan!");
  };

  // ── Submit: certificate ──────────────────────────────────────────────────
  const onSubmitCertificate = async (event) => {
    event.preventDefault();
    if (!userIsAdmin) return; // extra guard

    if (!certificateForm.title.trim() || !certificateForm.issuer.trim()) {
      showMessage("Sertifikat minimal wajib ada judul dan issuer.", "error");
      return;
    }

    let uploadedFileUrl = sanitizeText(certificateForm.fileUrl);

    if (certificateUpload) {
      // ── File upload validation ──
      const validationError = validateUploadFile(certificateUpload);
      if (validationError) {
        showMessage(validationError, "error");
        return;
      }

      if (!isSupabaseConfigured || !supabase || !session?.user) {
        showMessage("Upload file butuh Supabase aktif.", "error");
        return;
      }

      const safeName = certificateUpload.name
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .toLowerCase();
      const filePath = `certificates/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(CERTIFICATE_BUCKET)
        .upload(filePath, certificateUpload, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        showMessage(`Gagal upload: ${uploadError.message}`, "error");
        return;
      }

      const { data: publicData } = supabase.storage
        .from(CERTIFICATE_BUCKET)
        .getPublicUrl(filePath);

      uploadedFileUrl = publicData?.publicUrl || "";
    }

    const item = {
      id: crypto.randomUUID(),
      title: sanitizeText(certificateForm.title),
      issuer: sanitizeText(certificateForm.issuer),
      date: certificateForm.date || new Date().toISOString().slice(0, 10),
      description: sanitizeText(certificateForm.description),
      fileType: sanitizeText(certificateForm.fileType),
      fileUrl: uploadedFileUrl,
      verifyUrl: sanitizeText(certificateForm.verifyUrl),
      image: sanitizeText(certificateForm.image),
    };

    if (isSupabaseConfigured && supabase && session?.user) {
      const { data, error } = await supabase
        .from("certificates")
        .insert({
          title: item.title,
          issuer: item.issuer,
          issued_at: item.date,
          description: item.description,
          file_type: item.fileType,
          file_url: item.fileUrl,
          verify_url: item.verifyUrl,
          cover_image_url: item.image,
        })
        .select("id")
        .single();

      if (error) { showMessage(`Gagal simpan: ${error.message}`, "error"); return; }
      item.id = data.id;
    }

    setCertificates((prev) => [item, ...prev]);
    setCertificateForm(initialCertificateForm);
    setCertificateUpload(null);
    showMessage("Sertifikat berhasil ditambahkan!");
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const deleteProject = async (idToDelete, indexToDelete) => {
    if (!userIsAdmin) return;
    if (isSupabaseConfigured && supabase && session?.user && idToDelete) {
      const { error } = await supabase.from("projects").delete().eq("id", idToDelete);
      if (error) { showMessage(`Gagal: ${error.message}`, "error"); return; }
    }
    setProjects((prev) => prev.filter((_, idx) => idx !== indexToDelete));
  };

  const deleteCertificate = async (idToDelete, indexToDelete) => {
    if (!userIsAdmin) return;
    if (isSupabaseConfigured && supabase && session?.user && idToDelete) {
      const { error } = await supabase.from("certificates").delete().eq("id", idToDelete);
      if (error) { showMessage(`Gagal: ${error.message}`, "error"); return; }
    }
    setCertificates((prev) => prev.filter((_, idx) => idx !== indexToDelete));
  };

  // ── Render: loading ──────────────────────────────────────────────────────
  if (status === "loading" || isLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p style={{ color: "var(--text-muted)", textAlign: "center" }}>Loading…</p>
        </div>
      </div>
    );
  }

  // ── Render: not logged in ────────────────────────────────────────────────
  if (!session?.user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Admin Portal</h1>
          <p>Masuk pakai Google untuk mengelola content</p>
          <button className="btn-google" onClick={() => signIn("google")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>
          {message && (
            <p className={`auth-message auth-message-${messageType}`}>{message}</p>
          )}
        </div>
      </div>
    );
  }

  // ── Render: logged in but NOT admin ─────────────────────────────────────
  // This is a second layer after middleware — shown if middleware is somehow bypassed
  if (!userIsAdmin) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>Access Denied</h1>
          <p>Akun ini tidak memiliki akses admin.</p>
          <button
            className="btn-google"
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{ marginTop: "24px" }}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // ── Render: admin dashboard ──────────────────────────────────────────────
  return (
    <div style={{ padding: "100px 20px 80px", maxWidth: "1200px", margin: "0 auto" }}>

      {/* Header */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h1 style={{ fontSize: "2rem", fontFamily: '"Playfair Display", serif', color: "var(--text)" }}>
            Admin Dashboard
          </h1>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              padding: "10px 20px",
              background: "var(--gold)",
              color: "var(--bg)",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Logout ({session.user.email})
          </button>
        </div>
        <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>Kelola Project dan Sertifikat</p>
        <div style={{ display: "flex", gap: "24px" }}>
          <span style={{ color: "var(--text)" }}>📁 Projects: <strong>{projectCount}</strong></span>
          <span style={{ color: "var(--text)" }}>🏆 Certificates: <strong>{certificateCount}</strong></span>
        </div>
      </section>

      {/* Message */}
      {message && (
        <section style={{
          padding: "12px 16px",
          borderRadius: "6px",
          marginBottom: "24px",
          background: messageType === "error" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
          border: messageType === "error" ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(34,197,94,0.3)",
          color: messageType === "error" ? "#fca5a5" : "#86efac",
        }}>
          {message}
        </section>
      )}

      {/* ── Project Form ── */}
      <section style={{ marginBottom: "48px", padding: "32px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px" }}>
        <h2 style={{ fontSize: "1.5rem", fontFamily: '"Playfair Display", serif', marginBottom: "24px", color: "var(--text)" }}>
          Tambah Project
        </h2>
        <form onSubmit={onSubmitProject} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text)", fontWeight: "600" }}>Nama Project</label>
              <input
                type="text"
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                placeholder="Nama project"
                required
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--bg-soft)", color: "var(--text)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text)", fontWeight: "600" }}>Tipe</label>
              <select
                value={projectForm.type}
                onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--bg-soft)", color: "var(--text)" }}
              >
                <option>Project</option>
                <option>Game Project</option>
                <option>Web App</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--text)", fontWeight: "600" }}>Deskripsi</label>
            <textarea
              value={projectForm.text}
              onChange={(e) => setProjectForm({ ...projectForm, text: e.target.value })}
              placeholder="Deskripsi project"
              required
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--bg-soft)", color: "var(--text)", minHeight: "100px", fontFamily: "inherit" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--text)", fontWeight: "600" }}>Teknologi (comma separated)</label>
            <input
              type="text"
              value={projectForm.tech}
              onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
              placeholder="React, Firebase, Node.js"
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--bg-soft)", color: "var(--text)" }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text)", fontWeight: "600" }}>Live URL</label>
              <input
                type="text"
                value={projectForm.url}
                onChange={(e) => setProjectForm({ ...projectForm, url: e.target.value })}
                placeholder="https://..."
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--bg-soft)", color: "var(--text)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text)", fontWeight: "600" }}>GitHub URL</label>
              <input
                type="text"
                value={projectForm.github}
                onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                placeholder="https://github.com/..."
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--bg-soft)", color: "var(--text)" }}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }}>
            ➕ Tambah Project
          </button>
        </form>
      </section>

      {/* ── Certificate Form ── */}
      <section style={{ marginBottom: "48px", padding: "32px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px" }}>
        <h2 style={{ fontSize: "1.5rem", fontFamily: '"Playfair Display", serif', marginBottom: "24px", color: "var(--text)" }}>
          Tambah Sertifikat
        </h2>
        <form onSubmit={onSubmitCertificate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text)", fontWeight: "600" }}>Judul</label>
              <input
                type="text"
                value={certificateForm.title}
                onChange={(e) => setCertificateForm({ ...certificateForm, title: e.target.value })}
                placeholder="Judul sertifikat"
                required
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--bg-soft)", color: "var(--text)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text)", fontWeight: "600" }}>Penerbit</label>
              <input
                type="text"
                value={certificateForm.issuer}
                onChange={(e) => setCertificateForm({ ...certificateForm, issuer: e.target.value })}
                placeholder="Nama penerbit"
                required
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--bg-soft)", color: "var(--text)" }}
              />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text)", fontWeight: "600" }}>Tanggal</label>
              <input
                type="date"
                value={certificateForm.date}
                onChange={(e) => setCertificateForm({ ...certificateForm, date: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--bg-soft)", color: "var(--text)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text)", fontWeight: "600" }}>File Type</label>
              <select
                value={certificateForm.fileType}
                onChange={(e) => setCertificateForm({ ...certificateForm, fileType: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--bg-soft)", color: "var(--text)" }}
              >
                <option>pdf</option>
                <option>image</option>
                <option>link</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--text)", fontWeight: "600" }}>
              Upload File Sertifikat
              <span style={{ fontWeight: 400, color: "var(--text-muted)", marginLeft: "8px" }}>
                (PDF / JPG / PNG / WEBP — maks {MAX_FILE_SIZE_MB}MB)
              </span>
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.gif"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                if (file) {
                  const err = validateUploadFile(file);
                  if (err) { showMessage(err, "error"); e.target.value = ""; return; }
                }
                setCertificateUpload(file);
              }}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--bg-soft)", color: "var(--text)" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--text)", fontWeight: "600" }}>
              Atau masukkan URL file langsung
            </label>
            <input
              type="text"
              value={certificateForm.fileUrl}
              onChange={(e) => setCertificateForm({ ...certificateForm, fileUrl: e.target.value })}
              placeholder="https://..."
              style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--bg-soft)", color: "var(--text)" }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }}>
            ➕ Tambah Sertifikat
          </button>
        </form>
      </section>

      {/* ── Project list ── */}
      {projects.length > 0 && (
        <section style={{ marginBottom: "48px", padding: "32px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px" }}>
          <h2 style={{ fontSize: "1.5rem", fontFamily: '"Playfair Display", serif', marginBottom: "24px", color: "var(--text)" }}>
            Projects ({projectCount})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {projects.map((p, idx) => (
              <div key={p.id || idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--bg-soft)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                <div>
                  <strong style={{ color: "var(--text)" }}>{p.name}</strong>
                  <span style={{ marginLeft: "10px", color: "var(--text-muted)", fontSize: "0.85rem" }}>{p.type}</span>
                </div>
                <button
                  onClick={() => deleteProject(p.id, idx)}
                  style={{ padding: "6px 14px", background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Certificate list ── */}
      {certificates.length > 0 && (
        <section style={{ marginBottom: "48px", padding: "32px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px" }}>
          <h2 style={{ fontSize: "1.5rem", fontFamily: '"Playfair Display", serif', marginBottom: "24px", color: "var(--text)" }}>
            Sertifikat ({certificateCount})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {certificates.map((c, idx) => (
              <div key={c.id || idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--bg-soft)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                <div>
                  <strong style={{ color: "var(--text)" }}>{c.title}</strong>
                  <span style={{ marginLeft: "10px", color: "var(--text-muted)", fontSize: "0.85rem" }}>{c.issuer}</span>
                </div>
                <button
                  onClick={() => deleteCertificate(c.id, idx)}
                  style={{ padding: "6px 14px", background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
