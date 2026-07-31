"use client";

/**
 * app/admin/AdminDashboard.jsx
 * Admin dashboard — monochrome theme.
 * Contains all forms, lists, and mutation logic.
 */

import { signOut, useSession } from "next-auth/react";
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
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File terlalu besar. Maksimal ${MAX_FILE_SIZE_MB}MB.`;
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return `Tipe file tidak diizinkan: ${file.type}. Hanya PDF dan gambar yang diterima.`;
  }
  const ext = "." + file.name.split(".").pop().toLowerCase();
  if (BLOCKED_EXTENSIONS.includes(ext)) {
    return `Ekstensi file tidak diizinkan: ${ext}`;
  }
  return null;
}

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

export default function AdminDashboard() {
  const { data: session } = useSession();

  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [certificateForm, setCertificateForm] = useState(initialCertificateForm);
  const [certificateUpload, setCertificateUpload] = useState(null);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isLoading, setIsLoading] = useState(true);

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

  // ── Submit: project ──────────────────────────────────────────────────
  const onSubmitProject = async (event) => {
    event.preventDefault();
    if (!userIsAdmin) return;

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

  // ── Submit: certificate ──────────────────────────────────────────────
  const onSubmitCertificate = async (event) => {
    event.preventDefault();
    if (!userIsAdmin) return;

    if (!certificateForm.title.trim() || !certificateForm.issuer.trim()) {
      showMessage("Sertifikat minimal wajib ada judul dan issuer.", "error");
      return;
    }

    let uploadedFileUrl = sanitizeText(certificateForm.fileUrl);

    if (certificateUpload) {
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

  // ── Delete ──────────────────────────────────────────────────────────
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

  // ── Loading state ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p style={{ color: "var(--text-dim)", textAlign: "center" }}>Memuat dashboard…</p>
        </div>
      </div>
    );
  }

  // ── Render: dashboard ────────────────────────────────────────────
  return (
    <div className="admin-wrap">
      {/* Header */}
      <section className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-header-right">
          <span style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: "0.6rem", color: "var(--text-faint)" }}>
            {session?.user?.email}
          </span>
          <button className="admin-logout-btn" onClick={() => signOut({ callbackUrl: "/" })}>
            LOGOUT
          </button>
        </div>
      </section>

      <div className="admin-stats">
        <span className="admin-stat">📁 Projects: <strong>{projectCount}</strong></span>
        <span className="admin-stat">🏆 Certificates: <strong>{certificateCount}</strong></span>
      </div>

      {/* Message */}
      {message && (
        <div className={`admin-message ${messageType === "error" ? "admin-message-error" : "admin-message-success"}`}>
          {message}
        </div>
      )}

      {/* ── Project Form ── */}
      <section className="admin-section">
        <h2 className="admin-section-title">Tambah Project</h2>
        <form onSubmit={onSubmitProject}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Nama Project</label>
              <input
                className="admin-input"
                type="text"
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                placeholder="Nama project"
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Tipe</label>
              <select
                className="admin-select"
                value={projectForm.type}
                onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
              >
                <option>Project</option>
                <option>Game Project</option>
                <option>Web App</option>
              </select>
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Deskripsi</label>
            <textarea
              className="admin-textarea"
              value={projectForm.text}
              onChange={(e) => setProjectForm({ ...projectForm, text: e.target.value })}
              placeholder="Deskripsi project"
              required
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Teknologi (comma separated)</label>
            <input
              className="admin-input"
              type="text"
              value={projectForm.tech}
              onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
              placeholder="React, Firebase, Node.js"
            />
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Live URL</label>
              <input
                className="admin-input"
                type="text"
                value={projectForm.url}
                onChange={(e) => setProjectForm({ ...projectForm, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">GitHub URL</label>
              <input
                className="admin-input"
                type="text"
                value={projectForm.github}
                onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                placeholder="https://github.com/..."
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }}>
            ➕ Tambah Project
          </button>
        </form>
      </section>

      {/* ── Certificate Form ── */}
      <section className="admin-section">
        <h2 className="admin-section-title">Tambah Sertifikat</h2>
        <form onSubmit={onSubmitCertificate}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Judul</label>
              <input
                className="admin-input"
                type="text"
                value={certificateForm.title}
                onChange={(e) => setCertificateForm({ ...certificateForm, title: e.target.value })}
                placeholder="Judul sertifikat"
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Penerbit</label>
              <input
                className="admin-input"
                type="text"
                value={certificateForm.issuer}
                onChange={(e) => setCertificateForm({ ...certificateForm, issuer: e.target.value })}
                placeholder="Nama penerbit"
                required
              />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Tanggal</label>
              <input
                className="admin-input"
                type="date"
                value={certificateForm.date}
                onChange={(e) => setCertificateForm({ ...certificateForm, date: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">File Type</label>
              <select
                className="admin-select"
                value={certificateForm.fileType}
                onChange={(e) => setCertificateForm({ ...certificateForm, fileType: e.target.value })}
              >
                <option>pdf</option>
                <option>image</option>
                <option>link</option>
              </select>
            </div>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">
              Upload File Sertifikat
              <span className="admin-file-hint">
                (PDF / JPG / PNG / WEBP — maks {MAX_FILE_SIZE_MB}MB)
              </span>
            </label>
            <input
              className="admin-input"
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
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Atau masukkan URL file langsung</label>
            <input
              className="admin-input"
              type="text"
              value={certificateForm.fileUrl}
              onChange={(e) => setCertificateForm({ ...certificateForm, fileUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }}>
            ➕ Tambah Sertifikat
          </button>
        </form>
      </section>

      {/* ── Project list ── */}
      {projects.length > 0 && (
        <section className="admin-section">
          <h2 className="admin-section-title">Projects ({projectCount})</h2>
          <div className="admin-list">
            {projects.map((p, idx) => (
              <div key={p.id || idx} className="admin-list-item">
                <div className="admin-list-info">
                  <span className="admin-list-title">{p.name}</span>
                  <span className="admin-list-sub">{p.type}</span>
                </div>
                <button
                  className="admin-delete-btn"
                  onClick={() => deleteProject(p.id, idx)}
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
        <section className="admin-section">
          <h2 className="admin-section-title">Sertifikat ({certificateCount})</h2>
          <div className="admin-list">
            {certificates.map((c, idx) => (
              <div key={c.id || idx} className="admin-list-item">
                <div className="admin-list-info">
                  <span className="admin-list-title">{c.title}</span>
                  <span className="admin-list-sub">{c.issuer}</span>
                </div>
                <button
                  className="admin-delete-btn"
                  onClick={() => deleteCertificate(c.id, idx)}
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
