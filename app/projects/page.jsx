"use client";
/* app/projects/page.jsx — Mission Log (Refined Monochrome) */

import { useEffect, useState, useRef } from "react";
import SkeletonCard from "../../components/SkeletonCard";
import { isSupabaseConfigured, supabase } from "../../lib/supabaseClient";

const ADMIN_PROJECTS_KEY = "ragah_admin_projects_v2";
const parseJson = (v, fb = []) => {
    if (!v) return fb;
    try { const p = JSON.parse(v); return Array.isArray(p) ? p : fb; }
    catch { return fb; }
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

export default function ProjectsPage() {
    const [query, setQuery] = useState("");
    const [projects, setProjects] = useState([]);
    const [modeLabel, setModeLabel] = useState("Local");
    const [isLoading, setIsLoading] = useState(true);
    const [gridRef, gridRevealed] = useGridReveal();

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            if (isSupabaseConfigured && supabase) {
                const { data, error } = await supabase
                    .from("projects")
                    .select("id,name,description,project_type,tech,live_url,repo_url,image_url")
                    .order("created_at", { ascending: false });
                if (!error && data) {
                    setProjects(data.map((i) => ({
                        id: i.id, name: i.name, text: i.description,
                        type: i.project_type, tech: Array.isArray(i.tech) ? i.tech : [],
                        url: i.live_url, github: i.repo_url, image: i.image_url,
                    })));
                    setModeLabel("Supabase");
                    setIsLoading(false);
                    return;
                }
            }
            if (typeof window !== "undefined")
                setProjects(parseJson(window.localStorage.getItem(ADMIN_PROJECTS_KEY), []));
            setModeLabel("Local");
            setIsLoading(false);
        };
        load();
    }, []);

    useEffect(() => {
        const h = (e) => {
            if (e.key !== ADMIN_PROJECTS_KEY) return;
            setProjects(parseJson(e.newValue, []));
        };
        window.addEventListener("storage", h);
        return () => window.removeEventListener("storage", h);
    }, []);

    const items = projects.map((p, i) => ({
        id: p.id || `p-${i}`,
        title: p.name || "Untitled",
        description: p.text || "—",
        badge: p.type || "Project",
        chips: Array.isArray(p.tech) ? p.tech : [],
        primaryUrl: p.url,
        secondaryUrl: p.github,
        initial: p.name ? p.name.charAt(0).toUpperCase() : String(i + 1),
    }));

    const filtered = query.trim()
        ? items.filter((i) => {
            const q = query.toLowerCase();
            return i.title.toLowerCase().includes(q) ||
                i.description.toLowerCase().includes(q) ||
                i.chips.join(" ").toLowerCase().includes(q);
        })
        : items;

    return (
        <main className="page-shell collection-page">
            <section className="collection-wrap">
                <header className="collection-head">
                    <p className="eyebrow">QUESTS // BATTLE CHRONICLES</p>
                    <h1 className="section-title-lg">Epic Quests</h1>
                    <p>Proyek yang ditempa dari konsep hingga deployment — setiap pertempuran adalah mahakarya.</p>
                    <div className="collection-nav">
                        <a className="btn btn-primary" href="/certificates">TROPHIES →</a>
                        <a className="btn btn-ghost" href="/">← OLYMPUS</a>
                    </div>
                </header>

                <div className="collection-search">
                    <input
                        type="search"
                        placeholder="SEARCH QUESTS..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <small>{filtered.length} QUEST{filtered.length !== 1 ? "S" : ""} · {modeLabel.toUpperCase()}</small>
                </div>

                {isLoading ? (
                    <div className="collection-grid">
                        {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} variant="project" />)}
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
                                    {item.image ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={item.image} alt={item.title} className="parallax-zoom" />
                                    ) : (
                                        <span>{item.initial}</span>
                                    )}
                                </div>
                                <div className="collection-body">
                                    <span className="collection-badge">⚔ {item.badge}</span>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    {item.chips.length > 0 && (
                                        <div className="collection-chips">
                                            {item.chips.map((c, ci) => (
                                                <span key={`${item.id}-${ci}`}>{c}</span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="collection-actions">
                                        {item.primaryUrl && (
                                            <a className="btn btn-primary" href={item.primaryUrl} target="_blank" rel="noreferrer">
                                                ⚡ LAUNCH
                                            </a>
                                        )}
                                        {item.secondaryUrl && (
                                            <a className="btn btn-ghost" href={item.secondaryUrl} target="_blank" rel="noreferrer">
                                                🔱 FORGE
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
                        <h2>NO QUESTS FOUND</h2>
                        <p>{query ? "Ubah kata kunci pencarian." : "Belum ada project. Tambahkan dari admin panel."}</p>
                    </section>
                )}
            </section>
        </main>
    );
}
