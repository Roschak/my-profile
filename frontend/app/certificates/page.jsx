"use client";
/* app/certificates/page.jsx — Honours (Refined Monochrome) */

import { useEffect, useState, useRef } from "react";
import SkeletonCard from "../../components/SkeletonCard";
import { isSupabaseConfigured, supabase } from "../../lib/supabaseClient";

const ADMIN_CERTIFICATES_KEY = "ragah_admin_certificates_v2";
const parseJson = (v, fb = []) => {
    if (!v) return fb;
    try { const p = JSON.parse(v); return Array.isArray(p) ? p : fb; }
    catch { return fb; }
};

const fmtDate = (d) => {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return d || "—";
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(dt);
};

/* ── Intersection observer hook for entrance animations ── */
function useGridReveal(threshold = 0.05) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, revealed];
}

export default function CertificatesPage() {
    const [query, setQuery] = useState("");
    const [certs, setCerts] = useState([]);
    const [modeLabel, setModeLabel] = useState("Local");
    const [isLoading, setIsLoading] = useState(true);
    const [gridRef, gridRevealed] = useGridReveal();

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            if (isSupabaseConfigured && supabase) {
                const { data, error } = await supabase
                    .from("certificates")
                    .select("id,title,issuer,issued_at,description,file_type,file_url,verify_url,cover_image_url")
                    .order("created_at", { ascending: false });
                if (!error && data) {
                    setCerts(data.map((i) => ({
                        id: i.id, title: i.title, issuer: i.issuer,
                        date: i.issued_at, description: i.description,
                        fileType: i.file_type, fileUrl: i.file_url,
                        verifyUrl: i.verify_url,
                    })));
                    setModeLabel("Supabase");
                    setIsLoading(false);
                    return;
                }
            }
            if (typeof window !== "undefined")
                setCerts(parseJson(window.localStorage.getItem(ADMIN_CERTIFICATES_KEY), []));
            setModeLabel("Local");
            setIsLoading(false);
        };
        load();
    }, []);

    useEffect(() => {
        const h = (e) => {
            if (e.key !== ADMIN_CERTIFICATES_KEY) return;
            setCerts(parseJson(e.newValue, []));
        };
        window.addEventListener("storage", h);
        return () => window.removeEventListener("storage", h);
    }, []);

    const items = certs.map((c, i) => ({
        id: c.id || `c-${i}`,
        title: c.title || "Certificate",
        issuer: c.issuer || "Unknown",
        date: fmtDate(c.date),
        description: c.description || `Issued by ${c.issuer}`,
        fileUrl: c.fileUrl || c.verifyUrl,
        verifyUrl: c.verifyUrl,
        fileType: c.fileType || "pdf",
        index: i + 1,
    }));

    const filtered = query.trim()
        ? items.filter((i) => {
            const q = query.toLowerCase();
            return i.title.toLowerCase().includes(q) ||
                i.issuer.toLowerCase().includes(q) ||
                i.description.toLowerCase().includes(q);
        })
        : items;

    return (
        <main className="page-shell collection-page">
            <section className="collection-wrap">
                <header className="collection-head">
                    <p className="eyebrow">TROPHIES // HALL OF FAME</p>
                    <h1 className="section-title-lg">Trophies & Honours</h1>
                    <p>Sertifikat yang merekam progres belajar dan ketekunan praktik teknis — bukti perjalanan seorang pahlawan.</p>
                    <div className="collection-nav">
                        <a className="btn btn-primary" href="/projects">QUESTS →</a>
                        <a className="btn btn-ghost" href="/">← OLYMPUS</a>
                    </div>
                </header>

                <div className="collection-search">
                    <input
                        type="search"
                        placeholder="SEARCH TROPHIES..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <small>{filtered.length} TROPH{filtered.length !== 1 ? "IES" : "Y"} · {modeLabel.toUpperCase()}</small>
                </div>

                {isLoading ? (
                    <div className="collection-grid">
                        {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} variant="certificate" />)}
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="collection-grid" ref={gridRef}>
                        {filtered.map((item, idx) => (
                            <article
                                key={item.id}
                                className={`collection-card ${gridRevealed ? "reveal" : ""}`}
                                style={{ transitionDelay: `${idx * 60}ms` }}
                            >
                                <div className="collection-cover">
                                    {(item.fileType === "image" || item.fileType === "png" || item.fileType === "jpg" || item.fileType === "jpeg") && item.fileUrl ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={item.fileUrl} alt={item.title} className="parallax-zoom" />
                                    ) : (
                                        <span>{String(item.index).padStart(2, "0")}</span>
                                    )}
                                </div>
                                <div className="collection-body">
                                    <span className="collection-badge">🏆 {item.fileType.toUpperCase()}</span>
                                    <h3>{item.title}</h3>
                                    <p className="cert-subtitle">
                                        {item.issuer} · {item.date}
                                    </p>
                                    <p>{item.description}</p>
                                    <div className="collection-actions">
                                        {item.fileUrl && (
                                            <a className="btn btn-primary" href={item.fileUrl} target="_blank" rel="noreferrer">
                                                📜 OPEN SCROLL
                                            </a>
                                        )}
                                        {item.verifyUrl && (
                                            <a className="btn btn-ghost" href={item.verifyUrl} target="_blank" rel="noreferrer">
                                                🔍 VERIFY
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <section className="collection-empty panel">
                        <div className="collection-empty-icon">◈</div>
                        <h2>NO TROPHIES FOUND</h2>
                        <p>{query ? "Coba kata kunci lain." : "Belum ada sertifikat. Tambahkan dari admin panel."}</p>
                    </section>
                )}
            </section>
        </main>
    );
}
