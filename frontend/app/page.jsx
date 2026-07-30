"use client";
/* app/page.jsx — Mount Olympus // Greek Mythology Premium Theme */

import { useEffect, useState, useRef } from "react";
import PixelUrabeReal from "../components/PixelUrabeReal";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

/* ── Profile data ───────────────────────────────────────── */
const PROFILE = {
  name: "Ragah Dirotama Wijaya",
  tagline: "Full-stack Developer adaptif dan progresif.",
  title: "Full-Stack Developer & Cybersecurity Enthusiast",
  about:
    "Siswa SMK jurusan Pengembangan Perangkat Lunak dan Gim (PPLG) yang berfokus pada pengembangan Web Full Stack. Memiliki dedikasi tinggi mempelajari teknologi industri terbaru dan adaptif dalam lingkungan pemrograman yang dinamis. Spesialisasi membangun solusi web yang responsif dan fungsional menggunakan ekosistem JavaScript dan PHP.",
  stack: [
    { name: "Frontend (React, Next.js, Tailwind)", level: 85 },
    { name: "Backend (Node.js, Express, Laravel)", level: 78 },
    { name: "Database (MySQL, Firebase, Supabase)", level: 72 },
    { name: "Tools (Git, Docker, Vercel, Postman)", level: 80 },
    { name: "Cybersecurity (Network, Web Security)", level: 65 },
    { name: "AI Tools & Prompt Engineering", level: 82 },
  ],
  strengths: [
    { title: "High Adaptability", body: "Cepat mempelajari teknologi baru dan mengintegrasikannya ke workflow harian secara efektif." },
    { title: "Secure Dev Mindset", body: "Memiliki pondasi keamanan web dan jaringan untuk membangun aplikasi yang lebih tangguh." },
    { title: "Execution Focus", body: "Terbukti menuntaskan produk hingga deployment dan siap digunakan publik." },
    { title: "Continuous Learner", body: "Konsisten mengasah kemampuan full-stack sesuai kebutuhan industri terkini." },
  ],
  quote: "Gapailah cita-cita hingga setinggi langit, sehingga kita dapat bermanfaat bagi diri kita dan orang lain.",
  quoteAuthor: "~ Ragah. D. Wijaya",
  photoUrl: "/images/foto-aku.png",
  cvUrl: "/CV-RAGAH-DIROTAMA-WIJAYA.pdf",
  contactInfo: {
    address: "Komplek RH Jl. Rh. Acesukarna IV No.8\nRT.01/RW.03, Pasirmulya\nKec. Bogor Bar., Kota Bogor\nJawa Barat 16118",
    phone: "+62 812-1147-3740",
    email: "ragahbuana@gmail.com",
    availability: "Setiap saat",
  },
  socials: {
    instagram: "https://www.instagram.com/roschak_rk",
    github: "https://github.com/Roschak",
    facebook: "https://www.facebook.com/share/1HtcbQvqGJ/",
    linkedin: "https://www.linkedin.com/in/ragah-dirotama-wijaya-38303b30b",
  },
};

/* ── Hooks ──────────────────────────────────────────────── */
function useCounts() {
  const [counts, setCounts] = useState({ projects: 0, certificates: 0 });
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    Promise.all([
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("certificates").select("id", { count: "exact", head: true }),
    ]).then(([{ count: p }, { count: c }]) => {
      setCounts({ projects: p ?? 0, certificates: c ?? 0 });
    });
  }, []);
  return counts;
}

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useTypingEffect(text, speed = 40) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return displayed;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const p = Math.min(window.scrollY / window.innerHeight, 2);
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

/* ── Cursor Glow ────────────────────────────────────────── */
function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => { el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return <div className="cursor-glow" ref={ref} aria-hidden="true" />;
}

/* ── Section Reveal Wrapper ────────────────────────────── */
function SectionReveal({ children, delay = 0, className = "", threshold = 0.1 }) {
  const [ref, inView] = useInView(threshold);
  const delayClass = delay === 1 ? "section-reveal-delay-1" :
    delay === 2 ? "section-reveal-delay-2" :
    delay === 3 ? "section-reveal-delay-3" :
    delay === 4 ? "section-reveal-delay-4" : "";
  return (
    <div ref={ref} className={`section-reveal ${delayClass} ${inView ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

/* ── Divider Animated ──────────────────────────────────── */
function DividerAnimated() {
  const [ref, inView] = useInView(0.3);
  return <div ref={ref} className={`divider ${inView ? "visible" : ""}`} />;
}

/* ── Skill Card ─────────────────────────────────────────── */
function SkillCard({ icon, name, level, delay }) {
  const [ref, inView] = useInView(0.3);
  return (
    <div ref={ref} className={`skill-card glass ${inView ? "visible" : ""}`} style={{ transitionDelay: `${delay}ms`, "--fill": `${level}%` }}>
      <div className="skill-icon">{icon}</div>
      <div className="skill-info">
        <div className="skill-name">{name}</div>
        <div className="skill-bar"><div className="skill-fill" /></div>
      </div>
    </div>
  );
}

/* ── Strength Card ──────────────────────────────────────── */
function StrengthCard({ num, title, body, delay }) {
  const [ref, inView] = useInView(0.2);
  return (
    <article
      ref={ref}
      className="strength-card glass"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      <div className="strength-num">{num}</div>
      <div className="strength-title">{title}</div>
      <p className="strength-body">{body}</p>
    </article>
  );
}

/* ── Stat Panel ─────────────────────────────────────────── */
function StatPanel({ code, num, desc, delay }) {
  const [ref, inView] = useInView(0.3);
  const [animated, setAnimated] = useState(typeof num === "number" ? 0 : num);
  useEffect(() => {
    if (!inView || typeof num !== "number") return;
    const target = num;
    const duration = 1000;
    const start = performance.now();
    const timer = requestAnimationFrame(function animateCounter(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(eased * target);
      setAnimated(current);
      if (progress < 1) requestAnimationFrame(animateCounter);
    });
    return () => cancelAnimationFrame(timer);
  }, [inView, num]);
  return (
    <div ref={ref} className="stat-panel glass" style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(20px)",
      transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      <div className="stat-code">{code}</div>
      <div className="stat-number">{animated}</div>
      <div className="stat-desc">{desc}</div>
    </div>
  );
}

/* ── Contact Field ──────────────────────────────────────── */
function ContactField({ label, value }) {
  return (
    <div className="contact-field-row">
      <span className="cf-key">{label}</span>
      <span className="cf-val">{value}</span>
    </div>
  );
}

/* ── Photo Component (smooth fade + scale on scroll) ──── */
function ProfilePhoto() {
  const [imgError, setImgError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [ref, inView] = useInView(0.2);
  
  // Monogram fallback (initials)
  const initials = PROFILE.name.split(" ").map(n => n[0]).join("");
  
  return (
    <div ref={ref} className="profile-photo-wrap" style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0) scale(1)" : "translateY(24px) scale(0.9)",
      transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div className="profile-photo-inner" style={{ position: "relative", overflow: "hidden" }}>
        {/* Loading placeholder — shows initials, fades out when image loads */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: loaded && !imgError ? "transparent" : "rgba(255,255,255,0.03)",
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 700,
          color: "var(--accent-dim)",
          letterSpacing: "0.08em",
          transition: "opacity 0.4s ease, background 0.4s ease",
          opacity: imgError ? 0 : (loaded ? 0 : 1),
          pointerEvents: "none",
          zIndex: 2,
        }}>
          {initials}
        </div>

        {imgError ? (
          <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.03)",
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 700,
            color: "var(--accent-dim)",
            letterSpacing: "0.08em",
          }}>
            {initials}
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={PROFILE.photoUrl}
            alt={PROFILE.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", position: "relative", zIndex: 1 }}
            onLoad={() => setLoaded(true)}
            onError={() => { setImgError(true); setLoaded(true); }}
          />
        )}
      </div>
    </div>
  );
}

/* ── Hero Landing Overlay (centered name) ── */
function HeroLanding({ typedTitle, scrollProgress }) {
  const opacity = Math.max(0, 1 - scrollProgress * 2.5);
  const translateY = scrollProgress * -60;
  const scale = 1 - scrollProgress * 0.15;

  return (
    <section className="hero-landing" style={{
      opacity,
      transform: `translateY(${translateY}px) scale(${Math.max(0.7, scale)})`,
      pointerEvents: scrollProgress > 0.3 ? "none" : "auto",
    }}>
      <div className="hero-landing-content">
        <h1 className="hero-landing-name">
          <span className="glitch" data-text="RAGAH">RAGAH</span><br />
          <span className="dl-highlight">DIROTAMA</span><br />
          WIJAYA
        </h1>
        <div className="hero-landing-subtitle">
          <span className="dl-bracket">&lt;</span>
          {typedTitle}
          <span className="dl-bracket"> /&gt;</span>
          <span className="dl-cursor">_</span>
        </div>
        <p className="hero-landing-bio">{PROFILE.tagline}</p>
        <div className="hero-actions" style={{ marginTop: "32px", justifyContent: "center" }}>
          <a className="btn btn-primary" href={PROFILE.cvUrl} download>
            ↓ CV
          </a>
          <a className="btn btn-ghost" href="/projects">
            PROJECTS →
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator" style={{ opacity: Math.max(0, 1 - scrollProgress * 5) }}>
        <span className="scroll-text">SCROLL</span>
        <div className="scroll-arrow">
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <path d="M8 0L8 20M1 14L8 21L15 14" stroke="rgba(201,168,76,0.4)" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ── Main Page ──────────────────────────────────────────── */
export default function HomePage() {
  const counts = useCounts();
  const ci = PROFILE.contactInfo;
  const typedTitle = useTypingEffect(PROFILE.title, 35);
  const scrollProgress = useScrollProgress();
  const mainRef = useRef(null);

  return (
    <main ref={mainRef} className="page-shell">
      <CursorGlow />
      <div className="lightning-overlay" aria-hidden="true" />

      {/* ── Hero Landing (100vh, centered name) ── */}
      <HeroLanding typedTitle={typedTitle} scrollProgress={scrollProgress} />

      {/* ── Cloud Transition Overlay ────────────────────── */}
      <div className="cloud-transition-overlay" aria-hidden="true" />

      {/* ── Portfolio Content (scrolls up over dragon) ──── */}
      <div className="portfolio-content">
        {/* ── NAVBAR (fixed, always visible) ─────────────── */}
        <header className="top-nav">
          <span className="nav-brand">⚜ RAGAH-DW</span>
          <nav aria-label="Main navigation">
            <ul className="nav-links">
              <li><a href="#about">Origin</a></li>
              <li><a href="#skills">Arsenal</a></li>
              <li><a href="/projects">Quests</a></li>
              <li><a href="/certificates">Trophies</a></li>
              <li><a href="#contact">Reach</a></li>
            </ul>
          </nav>
        </header>

        {/* ── PROFILE PHOTO ─────────────────────────────── */}
        <section className="section-wrap photo-section">
          <SectionReveal threshold={0.15}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
              <ProfilePhoto />
              <div style={{ textAlign: "center" }}>
                <h2 className="section-title" style={{ marginBottom: "8px" }}>
                  Ragah <span className="accent">Dirotama</span> Wijaya
                </h2>
                <p style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  color: "var(--text-faint)",
                  textTransform: "uppercase",
                }}>
                  FULL-STACK DEVELOPER // MOUNT OLYMPUS
                </p>
              </div>
              <div className="hero-actions">
                <a className="btn btn-primary" href={PROFILE.cvUrl} download>
                  📜 Hero&apos;s Scroll ↓
                </a>
                <a className="btn btn-ghost" href="/projects">
                  View Quests →
                </a>
              </div>
            </div>
          </SectionReveal>
        </section>

        <DividerAnimated />

        {/* ── STATS ───────────────────────────────────────── */}
        <SectionReveal threshold={0.15}>
          <div className="stats-section">
            <div className="stats-inner">
              <StatPanel code="⚔ BAT-01" num={counts.projects} desc="Quests Completed" delay={0} />
              <StatPanel code="🏆 BAT-02" num={counts.certificates} desc="Trophies Earned" delay={100} />
              <StatPanel code="⚡ BAT-03" num="6+" desc="Divine Weapons" delay={200} />
              <StatPanel code="👑 BAT-04" num="100%" desc="Fate Fulfilled" delay={300} />
            </div>
          </div>
        </SectionReveal>

        <DividerAnimated />

        {/* ── ABOUT ───────────────────────────────────────── */}
        <section id="about" className="section-wrap">
          <SectionReveal threshold={0.15}>
            <div className="section-header">
              <div className="section-tag">TEMPLE // ORIGIN STORY</div>
              <h2 className="section-title">The <span className="accent">Origin</span></h2>
            </div>
          </SectionReveal>
          <div className="about-grid">
            <SectionReveal delay={1} threshold={0.15}>
              <div className="about-panel glass">
                <h3>{'// THE CHRONICLE'}</h3>
                <p>{PROFILE.about}</p>
              </div>
            </SectionReveal>
            <SectionReveal delay={2} threshold={0.15}>
              <div className="about-panel glass">
                <h3>{'// DIVINE CREST'}</h3>
                <div className="profile-row">
                  {[
                    ["NAME", PROFILE.name],
                    ["CODE", "RAGAH-DW // RGH-FSTK-2024"],
                    ["SCHOOL", "SMK JURUSAN PPLG"],
                    ["SPEC", "WEB FULL STACK + SEC"],
                    ["LANGUAGES", "ID / EN / SU"],
                    ["STATUS", "ACTIVE LEARNER"],
                  ].map(([k, v]) => (
                    <div className="profile-field" key={k}>
                      <span className="pf-key">{k}</span>
                      <span className="pf-val">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          </div>
        </section>

        <DividerAnimated />

        {/* ── SKILLS ──────────────────────────────────────── */}
        <section id="skills" className="section-wrap">
          <SectionReveal threshold={0.15}>
            <div className="section-header">
              <div className="section-tag">FORGE // DIVINE WEAPONS</div>
              <h2 className="section-title">Arsenal of <span className="accent">the Gods</span></h2>
            </div>
          </SectionReveal>
          <div className="skills-grid">
            {PROFILE.stack.map((s, i) => (
              <SkillCard key={s.name} icon={["⎔", "⚙", "▤", "◈", "◉", "◇"][i]} name={s.name} level={s.level} delay={i * 80} />
            ))}
          </div>
        </section>

        <DividerAnimated />

        {/* ── STRENGTHS ───────────────────────────────────── */}
        <section id="strengths" className="section-wrap">
          <SectionReveal threshold={0.15}>
            <div className="section-header">
              <div className="section-tag">VIRTUE // HEROIC TRAITS</div>
              <h2 className="section-title">Blessings of <span className="accent">the Gods</span></h2>
            </div>
          </SectionReveal>
          <div className="strengths-grid">
            {PROFILE.strengths.map((s, i) => (
              <StrengthCard key={s.title} num={`OP-${String(i + 1).padStart(2, "0")}`} title={s.title} body={s.body} delay={i * 100} />
            ))}
          </div>
        </section>

        <DividerAnimated />

        {/* ── QUOTE ───────────────────────────────────────── */}
        <SectionReveal threshold={0.2}>
          <section className="quote-section">
            <div className="quote-inner">
              <div className="quote-block glass">
                <p className="quote-text">{PROFILE.quote}</p>
                <p className="quote-author">{PROFILE.quoteAuthor}</p>
              </div>
            </div>
          </section>
        </SectionReveal>

        <DividerAnimated />

        {/* ── URABE PIXEL ──────────────────────────────── */}
        <SectionReveal threshold={0.15}>
          <section className="section-wrap" style={{ textAlign: "center" }}>
            <div className="section-header">
              <div className="section-tag" style={{ justifyContent: "center" }}>MYSTIC // SPIRIT GUIDE</div>
              <h2 className="section-title">Guardian <span className="accent">Spirit</span></h2>
            </div>
            <div style={{ maxWidth: "400px", margin: "0 auto", height: "420px" }}>
              <PixelUrabeReal />
            </div>
          </section>
        </SectionReveal>

        <DividerAnimated />

        {/* ── CONTACT ─────────────────────────────────────── */}
        <section id="contact" className="section-wrap">
          <SectionReveal threshold={0.15}>
            <div className="section-header">
              <div className="section-tag">THRONE // ZEUS AUDIENCE</div>
              <h2 className="section-title">Seek <span className="accent">Audience</span></h2>
            </div>
          </SectionReveal>
          <div className="contact-grid">
            <SectionReveal delay={1} threshold={0.15}>
              <div className="contact-panel glass">
                <h3>{'// OPEN GATE'}</h3>
                <p>
                  Punya project menarik atau kesempatan magang/PKL?
                  Saya siap berkolaborasi untuk menaklukkan tantangan bersama.
                </p>
                <a className="btn btn-primary" href={`mailto:${ci.email}`}>
                  → Send Your Oracle
                </a>
              </div>
            </SectionReveal>
            <SectionReveal delay={2} threshold={0.15}>
              <div className="contact-panel glass" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.6rem", color: "var(--text-faint)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                    {'// COORDINATES'}
                  </span>
                </div>
                <div style={{ padding: "0 24px" }}>
                  <ContactField label="LOCATION" value={ci.address.split("\n").join(", ")} />
                  <ContactField label="PHONE" value={ci.phone} />
                  <ContactField label="EMAIL" value={ci.email} />
                  <ContactField label="AVAILABLE" value={ci.availability} />
                </div>
              </div>
            </SectionReveal>
          </div>
        </section>

        <DividerAnimated />

        {/* ── FOOTER ──────────────────────────────────────── */}
        <SectionReveal threshold={0.15}>
          <footer className="site-footer">
            <div className="footer-inner">
              <span className="footer-brand">{'⚜ RAGAH-DW // OLYMPUS EST. '}{new Date().getFullYear()}{' // ALL RIGHTS RESERVED'}</span>
              <div className="social-links">
                {[
                  ["IG", PROFILE.socials.instagram, "Instagram"],
                  ["GH", PROFILE.socials.github, "GitHub"],
                  ["FB", PROFILE.socials.facebook, "Facebook"],
                  ["IN", PROFILE.socials.linkedin, "LinkedIn"],
                ].map(([label, href, ariaLabel]) => (
                  <a key={label} className="social-badge" href={href} target="_blank" rel="noreferrer" aria-label={ariaLabel}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </footer>
        </SectionReveal>
      </div>
    </main>
  );
}
