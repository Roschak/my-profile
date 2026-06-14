/* page.jsx — Luxury Jazz / Old Money Cinematic Portfolio */
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import ParticleField from "../components/ParticleField";
import PixelUrabe from "../components/PixelUrabeReal";

const fallbackProfile = {
  name: "Ragah Dirotama Wijaya",
  tagline:
    "Full-stack Developer adaptif dan progresif yang membangun produk digital modern dari ide hingga rilis.",
  about:
    "Siswa SMK jurusan Pengembangan Perangkat Lunak dan Gim (PPLG) yang berfokus pada pengembangan Web Full Stack. Memiliki dedikasi tinggi dalam mempelajari teknologi industri terbaru dan adaptif dalam lingkungan pemrograman yang dinamis. Spesialisasi dalam membangun solusi web yang responsif dan fungsional menggunakan ekosistem JavaScript dan PHP.",
  stack: [
    "Frontend: HTML, CSS, JavaScript (ES6+), React.js.",
    "Backend: PHP, Laravel, Node.js, Express.js.",
    "Database: MySQL, Firebase (Firestore & Authentication).",
    "Tools & Platform: Git, GitHub, Postman, Vercel Deployment.",
    "Produktivitas: Implementasi AI Tools untuk efisiensi alur kerja pemrograman."
  ],
  languages: ["Bahasa Indonesia", "English (Intermediate)", "Sunda"],
  strengths: [
    {
      title: "Adaptasi Tinggi",
      text: "Cepat mempelajari teknologi baru dan mengintegrasikannya ke workflow harian secara efektif."
    },
    {
      title: "Secure Development Mindset",
      text: "Memiliki pondasi keamanan web dan jaringan untuk membangun aplikasi yang lebih tangguh."
    },
    {
      title: "Execution Focus",
      text: "Terbukti mampu menuntaskan produk hingga deployment dan siap digunakan publik."
    },
    {
      title: "Continuous Learner",
      text: "Konsisten mengasah kemampuan full-stack sesuai kebutuhan industri dan tren teknologi terbaru."
    }
  ],
  projects: [],
  quote:
    "Gapailah cita-cita hingga setinggi langit, sehingga kita dapat bermanfaat bagi diri kita dan orang lain.",
  quoteAuthor: "~Ragah. D. Wijaya",
  photoUrl: "/images/foto-aku.png",
  cvUrl: "/CV-RAGAH-DIROTAMA-WIJAYA.pdf",
  contactInfo: {
    address:
      "Komplek RH Jl. Rh. Acesukarna IV No.8\nRT.01/RW.03, Pasirmulya\nKec. Bogor Bar.\nKota Bogor\nJawa Barat 16118",
    phone: "+62 812-1147-3740",
    email: "ragahbuana@gmail.com",
    availability: "Setiap saat"
  },
  socials: {
    instagram: "https://www.instagram.com/roschak_rk",
    github: "https://github.com/Roschak",
    facebook: "https://www.facebook.com/share/1HtcbQvqGJ/",
    linkedin: "https://www.linkedin.com/in/ragah-dirotama-wijaya-38303b30b"
  }
};

export default function HomePage() {
  const [profile, setProfile] = useState(fallbackProfile);

  const contactInfo = {
    ...fallbackProfile.contactInfo,
    ...(profile.contactInfo || {})
  };

  const apiBaseUrl = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000",
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    const loadProfile = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/profile`, {
          signal: controller.signal
        });
        if (!response.ok) throw new Error("Gagal mengambil data profil.");
        const data = await response.json();
        setProfile((prev) => ({ ...prev, ...data.profile }));
      } catch {
        // Keep fallback data when API is not reachable.
      }
    };
    loadProfile();
    return () => controller.abort();
  }, [apiBaseUrl]);

  return (
    <main className="page-shell">
      {/* ── Cinematic starry background ── */}
      <ParticleField />

      <div className="content-wrap">

        {/* ── Navigation ── */}
        <header className="top-nav">
          <a className="brand" href="#home">Ragah</a>
          <nav>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#services">Services</a>
            <a href="/projects">Projects</a>
            <a href="/certificates">Certificates</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        {/* ── Hero ── */}
        <section id="home" className="hero-shell-v2">
          <div className="hero-content-v2">

            {/* Text column */}
            <div className="hero-text">
              <p className="hero-eyebrow">Full-stack Developer</p>

              <h1 className="hero-title">
                Ragah<br />
                <span className="accent">Dirotama</span><br />
                Wijaya
              </h1>

              <div className="hero-divider" aria-hidden="true" />

              <p className="hero-subtitle">
                Building modern digital products from idea to release —
                with precision, elegance, and a passion for clean code.
              </p>

              <div className="hero-meta">
                <span className="hero-meta-pill">
                  <span className="dot" aria-hidden="true" />
                  Bogor, Indonesia
                </span>
                <span className="hero-meta-pill">
                  <span className="dot" aria-hidden="true" />
                  Full-stack · UI · API
                </span>
                <span className="hero-meta-pill">
                  <span className="dot" aria-hidden="true" />
                  Open to Opportunities
                </span>
              </div>

              <div className="hero-actions-v2">
                <a className="btn btn-primary" href={profile.cvUrl} download>
                  Download CV
                </a>
                <a className="btn btn-secondary" href="/projects">
                  View Projects
                </a>
              </div>
            </div>

            {/* Photo column */}
            <div className="hero-photo-v2">
              <div className="photo-container-v2">
                <div className="photo-caption">Orbit Portrait</div>
                <div className="photo-frame-v2">
                  <Image
                    src={profile.photoUrl}
                    alt={`Foto ${profile.name}`}
                    fill
                    priority
                    sizes="(max-width: 768px) 90vw, 400px"
                    style={{ objectFit: "contain", objectPosition: "center top" }}
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Quote ── */}
        <blockquote className="quote-box">
          <p>{profile.quote}</p>
          <span>{profile.quoteAuthor || "~Ragah. D. Wijaya"}</span>
        </blockquote>

        {/* ── Stats ── */}
        <section className="intro-stats" aria-label="Ringkasan capaian">
          <article className="stat-item">
            <strong>2+</strong>
            <span>Years Learning</span>
          </article>
          <article className="stat-item">
            <strong>3+</strong>
            <span>Full-Stack Stacks</span>
          </article>
          <article className="stat-item">
            <strong>100%</strong>
            <span>Delivery Commitment</span>
          </article>
        </section>

        {/* ── About ── */}
        <section id="about" className="section-wrap about-section">
          <div className="section-head">
            <p className="section-label">About Me</p>
            <h2>Get to Know Me Better</h2>
          </div>
          <div className="about-grid">
            <article className="about-copy">
              <p>{profile.about}</p>
            </article>
            <aside className="about-photo-board">
              <div className="photo-frame photo-frame-about">
                <Image
                  src={profile.photoUrl}
                  alt={`Foto ${profile.name}`}
                  width={340}
                  height={340}
                />
              </div>
              <h3>{profile.name}</h3>
              <p>{profile.tagline}</p>
            </aside>
          </div>
        </section>

        {/* ── Skills ── */}
        <section id="skills" className="section-wrap">
          <div className="section-head">
            <p className="section-label">Technical Skills</p>
            <h2>Keahlian Teknis</h2>
          </div>
          <ul className="skills-flow">
            {(profile.stack || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* ── Services / Strengths ── */}
        <section id="services" className="section-wrap">
          <div className="section-head">
            <p className="section-label">What I Do</p>
            <h2>Pendekatan Kerja</h2>
            <p>Cara saya membangun produk digital yang bermakna.</p>
          </div>
          <div className="service-grid">
            {(profile.strengths || []).map((item) => (
              <article className="service-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="contact" className="section-wrap">
          <div className="section-head">
            <p className="section-label">Contact</p>
            <h2>Let&apos;s Work Together</h2>
          </div>
          <div className="contact-layout">
            <article className="contact-panel">
              <h3>Let&apos;s Talk</h3>
              <p>
                Punya project menarik atau kesempatan magang/PKL? Saya siap
                diskusi dan berkolaborasi untuk hasil terbaik.
              </p>
              <a className="btn btn-primary" href={`mailto:${contactInfo.email}`}>
                Kirim Email
              </a>
            </article>
            <div className="contact-grid">
              <article className="contact-card">
                <h3>Alamat</h3>
                <p className="contact-address">{contactInfo.address}</p>
              </article>
              <article className="contact-card">
                <h3>Telepon</h3>
                <p>{contactInfo.phone}</p>
              </article>
              <article className="contact-card">
                <h3>Email</h3>
                <p>{contactInfo.email}</p>
              </article>
              <article className="contact-card">
                <h3>Ketersediaan</h3>
                <p>{contactInfo.availability}</p>
              </article>
            </div>
          </div>
        </section>

        {/* ── Pixel Character ── */}
        <section className="section-wrap pixel-showcase" aria-label="Pixel character showcase">
          <div className="section-head">
            <p className="section-label">Companion</p>
            <h2>Pixel Character</h2>
          </div>
          <div className="pixel-stage-wrap">
            <div className="pixel-stage">
              <div className="character-canvas-wrap">
                <PixelUrabe />
                <div className="character-glow" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Social Footer ── */}
        <footer className="social-section">
          <p>Connect with me</p>
          <div className="social-links">
            <a
              className="social-badge"
              href={profile.socials?.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >IG</a>
            <a
              className="social-badge"
              href={profile.socials?.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >GH</a>
            <a
              className="social-badge"
              href={profile.socials?.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >FB</a>
            <a
              className="social-badge"
              href={profile.socials?.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >IN</a>
          </div>
          <p className="contact-note">Instagram · GitHub · Facebook · LinkedIn</p>
        </footer>

      </div>
    </main>
  );
}
