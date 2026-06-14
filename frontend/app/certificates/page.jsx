/* certificates/page.jsx — Luxury Jazz Portfolio */
"use client";

import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../../lib/supabaseClient";

const ADMIN_CERTIFICATES_KEY = "ragah_admin_certificates_v2";

const parseStorageJson = (value, fallback = []) => {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const formatDate = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
};

export default function CertificatesPage() {
  const [query, setQuery] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [modeLabel, setModeLabel] = useState("Local");

  useEffect(() => {
    const load = async () => {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from("certificates")
          .select(
            "id,title,issuer,issued_at,description,file_type,file_url,verify_url,cover_image_url"
          )
          .order("created_at", { ascending: false });

        if (!error && data) {
          setCertificates(
            data.map((item) => ({
              id: item.id,
              title: item.title,
              issuer: item.issuer,
              date: item.issued_at,
              description: item.description,
              fileType: item.file_type,
              fileUrl: item.file_url,
              verifyUrl: item.verify_url,
              image: item.cover_image_url
            }))
          );
          setModeLabel("Supabase");
          return;
        }
      }

      const adminCertificates = parseStorageJson(
        window.localStorage.getItem(ADMIN_CERTIFICATES_KEY),
        []
      );
      setCertificates(adminCertificates);
      setModeLabel("Local");
    };

    load();
  }, []);

  useEffect(() => {
    const onStorageChange = (event) => {
      if (event.key !== ADMIN_CERTIFICATES_KEY) return;
      setCertificates(
        parseStorageJson(
          window.localStorage.getItem(ADMIN_CERTIFICATES_KEY),
          []
        )
      );
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  const items = certificates.map((item, index) => ({
    id: item.id || `certificate-${index}`,
    title: item.title,
    issuer: item.issuer,
    date: formatDate(item.date),
    description: item.description || `Issued by ${item.issuer}`,
    fileUrl: item.fileUrl || item.verifyUrl,
    verifyUrl: item.fileUrl && item.verifyUrl ? item.verifyUrl : "",
    fileType: item.fileType || "pdf"
  }));

  const filteredItems = items.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title?.toLowerCase().includes(q) ||
      item.issuer?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "120px 32px 100px",
        background: "var(--bg)",
        position: "relative"
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      <div style={{ maxWidth: "1240px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* ── Page Header ── */}
        <header style={{ textAlign: "center", marginBottom: "64px" }}>
          <p
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--gold)",
              marginBottom: "16px"
            }}
          >
            <span style={{ display: "block", width: 28, height: 1, background: "var(--gold)", opacity: 0.6 }} />
            Achievements
            <span style={{ display: "block", width: 28, height: 1, background: "var(--gold)", opacity: 0.6 }} />
          </p>
          <h1
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
              fontWeight: 700,
              color: "var(--champagne)",
              letterSpacing: "-0.02em",
              marginBottom: "16px",
              lineHeight: 1.1
            }}
          >
            Certificates &amp; Honours
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
              fontWeight: 300,
              maxWidth: "48ch",
              margin: "0 auto 32px"
            }}
          >
            Certifications and milestones earned through dedication and craft.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <a
              href="/projects"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 20px",
                background: "rgba(212,175,55,0.08)",
                color: "var(--gold)",
                border: "1px solid rgba(212,175,55,0.3)",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "all 180ms ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(212,175,55,0.15)";
                e.currentTarget.style.borderColor = "var(--gold)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(212,175,55,0.08)";
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)";
              }}
            >
              View Projects
            </a>
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "9px 20px",
                background: "transparent",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "all 180ms ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--gold)";
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              ← Back Home
            </a>
          </div>
        </header>

        {/* ── Search ── */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            marginBottom: "48px",
            flexWrap: "wrap"
          }}
        >
          <div style={{ flex: 1, position: "relative", minWidth: "240px" }}>
            <input
              type="search"
              placeholder="Search certificates by title, issuer, or description..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 44px",
                background: "rgba(13,15,24,0.8)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--text)",
                fontSize: "0.9rem",
                backdropFilter: "blur(12px)",
                outline: "none",
                transition: "border-color 180ms ease"
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
            />
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                pointerEvents: "none"
              }}
            >
              ⌕
            </span>
          </div>
          <span
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.8rem",
              letterSpacing: "0.06em",
              whiteSpace: "nowrap"
            }}
          >
            {filteredItems.length} certificate{filteredItems.length !== 1 ? "s" : ""} · {modeLabel}
          </span>
        </div>

        {/* ── Grid ── */}
        {filteredItems.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "28px"
            }}
          >
            {filteredItems.map((item) => (
              <CertificateCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState query={query} />
        )}

      </div>
    </div>
  );
}

function CertificateCard({ item }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${hovered ? "rgba(212,175,55,0.35)" : "rgba(212,175,55,0.1)"}`,
        borderRadius: "14px",
        overflow: "hidden",
        background: "rgba(13,15,24,0.72)",
        backdropFilter: "blur(12px)",
        transition: "all 320ms cubic-bezier(0.16,1,0.3,1)",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 8px 32px rgba(212,175,55,0.15), 0 20px 60px rgba(0,0,0,0.7)"
          : "0 8px 32px rgba(0,0,0,0.4)"
      }}
    >
      {/* Card header / seal area */}
      <div
        style={{
          width: "100%",
          height: "180px",
          background: hovered
            ? "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(147,100,220,0.06))"
            : "linear-gradient(135deg, rgba(212,175,55,0.03), rgba(147,100,220,0.03))",
          borderBottom: `1px solid ${hovered ? "rgba(212,175,55,0.2)" : "rgba(212,175,55,0.08)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 320ms ease",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Corner ornaments */}
        {[
          { top: 14, left: 14, borderTop: true, borderLeft: true },
          { top: 14, right: 14, borderTop: true, borderRight: true },
          { bottom: 14, left: 14, borderBottom: true, borderLeft: true },
          { bottom: 14, right: 14, borderBottom: true, borderRight: true }
        ].map((pos, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={{
              position: "absolute",
              width: 18,
              height: 18,
              ...pos,
              borderTop: pos.borderTop ? "1px solid rgba(212,175,55,0.3)" : undefined,
              borderLeft: pos.borderLeft ? "1px solid rgba(212,175,55,0.3)" : undefined,
              borderBottom: pos.borderBottom ? "1px solid rgba(212,175,55,0.3)" : undefined,
              borderRight: pos.borderRight ? "1px solid rgba(212,175,55,0.3)" : undefined,
              opacity: hovered ? 1 : 0.4,
              transition: "opacity 320ms ease"
            }}
          />
        ))}

        {/* Seal */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: `1px solid ${hovered ? "rgba(212,175,55,0.5)" : "rgba(212,175,55,0.2)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: '"Playfair Display", serif',
              fontSize: "0.65rem",
              fontWeight: 700,
              color: hovered ? "var(--gold)" : "rgba(212,175,55,0.5)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: "rgba(212,175,55,0.04)",
              transition: "all 320ms ease",
              transform: hovered ? "scale(1.1)" : "scale(1)"
            }}
          >
            CERT
          </div>
          <span
            style={{
              fontSize: "0.72rem",
              color: hovered ? "var(--text-muted)" : "var(--text-secondary)",
              letterSpacing: "0.08em",
              transition: "color 320ms ease"
            }}
          >
            {item.issuer}
          </span>
        </div>
      </div>

      {/* Card content */}
      <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <span
          style={{
            display: "inline-block",
            background: "rgba(212,175,55,0.1)",
            color: "var(--gold)",
            fontSize: "0.7rem",
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: "3px",
            marginBottom: "14px",
            width: "fit-content",
            textTransform: "uppercase",
            letterSpacing: "0.12em"
          }}
        >
          Certificate
        </span>

        <h3
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: "1.15rem",
            fontWeight: 700,
            color: hovered ? "var(--champagne)" : "var(--text)",
            marginBottom: "6px",
            lineHeight: 1.3,
            transition: "color 200ms ease"
          }}
        >
          {item.title}
        </h3>

        <p
          style={{
            color: "var(--gold)",
            fontSize: "0.82rem",
            fontWeight: 600,
            marginBottom: "10px",
            letterSpacing: "0.04em"
          }}
        >
          {item.issuer}
        </p>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.88rem",
            lineHeight: 1.75,
            marginBottom: "16px",
            flex: 1,
            fontWeight: 300
          }}
        >
          {item.description}
        </p>

        {/* Meta */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
          <span
            style={{
              background: "rgba(147,100,220,0.1)",
              color: "rgba(180,140,255,0.85)",
              fontSize: "0.72rem",
              padding: "3px 10px",
              borderRadius: "3px",
              fontWeight: 500
            }}
          >
            {item.date}
          </span>
          {item.fileType && (
            <span
              style={{
                background: "rgba(147,100,220,0.1)",
                color: "rgba(180,140,255,0.85)",
                fontSize: "0.72rem",
                padding: "3px 10px",
                borderRadius: "3px",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.06em"
              }}
            >
              {item.fileType}
            </span>
          )}
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            borderTop: "1px solid rgba(212,175,55,0.08)",
            paddingTop: "16px"
          }}
        >
          {item.fileUrl && (
            <CertLink
              href={item.fileUrl}
              label={item.fileType === "pdf" ? "View PDF" : "View Certificate"}
              primary
            />
          )}
          {item.verifyUrl && (
            <CertLink href={item.verifyUrl} label="Verify" />
          )}
        </div>
      </div>
    </article>
  );
}

function CertLink({ href, label, primary }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        padding: "9px",
        textAlign: "center",
        textDecoration: "none",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        borderRadius: "4px",
        transition: "all 180ms ease",
        color: primary
          ? hovered ? "#07080d" : "var(--gold)"
          : hovered ? "var(--gold)" : "var(--text-muted)",
        border: primary
          ? `1px solid ${hovered ? "var(--gold)" : "rgba(212,175,55,0.3)"}`
          : `1px solid ${hovered ? "rgba(212,175,55,0.3)" : "var(--border)"}`,
        background: primary
          ? hovered ? "var(--gold)" : "transparent"
          : hovered ? "rgba(212,175,55,0.05)" : "transparent"
      }}
    >
      {label}
    </a>
  );
}

function EmptyState({ query }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 20px",
        background: "rgba(13,15,24,0.6)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        backdropFilter: "blur(12px)"
      }}
    >
      <p
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: "1.4rem",
          color: "var(--champagne)",
          marginBottom: "10px"
        }}
      >
        {query ? "No results found" : "No certificates yet"}
      </p>
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: 300 }}>
        {query
          ? "Try a different search query"
          : "Certificates will appear here once added via the admin panel"}
      </p>
    </div>
  );
}
