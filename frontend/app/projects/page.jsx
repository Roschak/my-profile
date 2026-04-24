"use client";

import { useEffect, useMemo, useState } from "react";

const fallbackData = {
  projects: [
    {
      name: "Green Live Initiative (GLI)",
      text: "Platform inisiatif lingkungan dengan pengalaman pengguna yang responsif dan modern.",
      url: "https://gli-project-web.web.app",
      github: "https://github.com/Roschak",
      type: "Project",
      tech: ["React", "Firebase", "UI/UX"],
      image: ""
    },
    {
      name: "Hungry Greens Salad",
      text: "Web app bisnis makanan sehat dengan performa cepat dan UI clean.",
      url: "https://hungrygreenssalad-v2.vercel.app",
      github: "https://github.com/Roschak",
      type: "Project",
      tech: ["HTML", "CSS", "JavaScript"],
      image: ""
    },
    {
      name: "Jakarta Dream (Game)",
      text: "Game project yang dipublikasikan di Itch.io dengan tema Jakarta Dream.",
      url: "https://skanic.itch.io/jakarta-dream",
      github: "https://github.com/Roschak",
      type: "Game Project",
      tech: ["Unity", "C#", "Itch.io"],
      image: ""
    }
  ],
  certificates: [
    {
      title: "Belajar Back-End Pemula Dengan JavaScript",
      issuer: "Dicoding",
      date: "2026-02-01",
      verifyUrl: "https://www.dicoding.com/",
      image: ""
    },
    {
      title: "Belajar Dasar AI",
      issuer: "Dicoding",
      date: "2026-02-01",
      verifyUrl: "https://www.dicoding.com/",
      image: ""
    },
    {
      title: "Belajar Dasar Cloud dan Gen AI di AWS",
      issuer: "Dicoding",
      date: "2026-02-01",
      verifyUrl: "https://www.dicoding.com/",
      image: ""
    }
  ]
};

const formatDate = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "numeric",
    year: "numeric"
  }).format(date);
};

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [profile, setProfile] = useState(fallbackData);

  const apiBaseUrl = useMemo(() => {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/profile`, { signal: controller.signal });
        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setProfile((prev) => ({
          ...prev,
          projects: data.profile?.projects || prev.projects,
          certificates: data.profile?.certificates || prev.certificates
        }));
      } catch {
        // Keep fallback data when API is not reachable.
      }
    };

    load();
    return () => controller.abort();
  }, [apiBaseUrl]);

  const projectItems = (profile.projects || []).map((item, index) => ({
    id: `project-${index}`,
    category: "projects",
    title: item.name,
    description: item.text,
    image: item.image,
    badge: item.type || "Project",
    chips: item.tech || [],
    primaryUrl: item.url,
    secondaryUrl: item.github,
    secondaryLabel: "GitHub",
    primaryLabel: "View Details"
  }));

  const certificateItems = (profile.certificates || []).map((item, index) => ({
    id: `certificate-${index}`,
    category: "certificates",
    title: item.title,
    description: `Penerbit: ${item.issuer}`,
    image: item.image,
    badge: "Certificate",
    chips: [formatDate(item.date)],
    primaryUrl: item.verifyUrl,
    secondaryUrl: "",
    secondaryLabel: "",
    primaryLabel: "Lihat Sertifikat"
  }));

  const allItems = [...projectItems, ...certificateItems];

  const filteredItems = allItems.filter((item) => {
    if (filter !== "all" && item.category !== filter) return false;

    if (!query.trim()) return true;

    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.chips.join(" ").toLowerCase().includes(q)
    );
  });

  return (
    <main className="projects-hub">
      <section className="projects-head">
        <h1>My Portfolio</h1>
        <p>Projects &amp; Achievements</p>
      </section>

      <section className="projects-controls">
        <label className="projects-search" htmlFor="projects-search">
          <span>Search</span>
          <input
            id="projects-search"
            type="search"
            placeholder="Search projects or certificates..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className="projects-filters" role="tablist" aria-label="Filter items">
          <button
            type="button"
            className={filter === "all" ? "is-active" : ""}
            onClick={() => setFilter("all")}
          >
            All ({allItems.length})
          </button>
          <button
            type="button"
            className={filter === "projects" ? "is-active" : ""}
            onClick={() => setFilter("projects")}
          >
            Projects ({projectItems.length})
          </button>
          <button
            type="button"
            className={filter === "certificates" ? "is-active" : ""}
            onClick={() => setFilter("certificates")}
          >
            Certificates ({certificateItems.length})
          </button>
        </div>
      </section>

      <section className="projects-grid-wrap">
        <div className="projects-grid">
          {filteredItems.map((item) => (
            <article key={item.id} className={`hub-card ${item.category}`}>
              <div className="hub-preview">
                {item.image ? (
                  <img src={item.image} alt={item.title} />
                ) : (
                  <div className="hub-preview-placeholder">
                    <strong>{item.title}</strong>
                  </div>
                )}
                <span className="hub-badge">{item.badge}</span>
              </div>

              <div className="hub-body">
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <ul className="hub-tags">
                  {item.chips.map((chip) => (
                    <li key={`${item.id}-${chip}`}>{chip}</li>
                  ))}
                </ul>
                <div className="hub-actions">
                  <a href={item.primaryUrl} target="_blank" rel="noreferrer">
                    {item.primaryLabel}
                  </a>
                  {item.secondaryUrl ? (
                    <a className="ghost" href={item.secondaryUrl} target="_blank" rel="noreferrer">
                      {item.secondaryLabel}
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
