/* page.jsx */
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
  languages: [
    "Bahasa Indonesia",
    "English (Intermediate)",
    "Sunda"
  ],
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
  const languages = profile.languages || fallbackProfile.languages;
  const contactInfo = {
    ...fallbackProfile.contactInfo,
    ...(profile.contactInfo || {})
  };

  const getDomain = (url) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "link-project";
    }
  };

  const apiBaseUrl = useMemo(() => {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/profile`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data profil.");
        }

        const data = await response.json();
        setProfile((prev) => ({ ...prev, ...data.profile }));
      } catch (error) {
        // Keep fallback data when API is not reachable.
      }
    };

    loadProfile();

    return () => controller.abort();
  }, [apiBaseUrl]);

  return (
    <main className="page-shell">
      <ParticleField />

      <div className="content-wrap">

      <header className="top-nav">
        <a className="brand" href="#home">
          Ragah
        </a>
        <nav>
          <a href="#bahasa">Bahasa</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#services">Services</a>
          <a href="/projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section id="home" className="hero-shell">
        <article className="hero-copy">
          <p className="hero-kicker">Full-stack Developer Portfolio</p>
          <h1>{profile.tagline}</h1>
          <p>
            Saya membangun produk digital end-to-end: dari desain antarmuka,
            integrasi API, sampai deployment yang siap dipakai secara publik.
          </p>

          <div className="hero-actions">
            <a className="btn btn-primary" href={profile.cvUrl} download>
              Download CV
            </a>
            <a className="btn" href="/projects">
              Lihat Projects
            </a>
            <a className="btn" href="#contact">
              Hubungi Saya
            </a>
          </div>
        </article>

        <aside className="hero-photo-wrap" aria-label="Profile photo showcase">
          <div className="hero-photo-card">
            <div className="photo-frame photo-frame-hero">
              <Image
                src={profile.photoUrl}
                alt={`Foto ${profile.name}`}
                width={420}
                height={420}
                priority
              />
            </div>
            <h3>{profile.name}</h3>
            <p>Full-stack Developer</p>
          </div>
        </aside>
      </section>

      <section className="quote-box">
        <p>{profile.quote}</p>
        <span>{profile.quoteAuthor || "~Ragah. D. Wijaya"}</span>
      </section>

      <section className="intro-stats" aria-label="Ringkasan capaian">
        <article className="stat-item">
          <strong>{(profile.projects || []).length}+</strong>
          <span>Project Ditampilkan</span>
        </article>
        <article className="stat-item">
          <strong>3+</strong>
          <span>Stack Full-Stack</span>
        </article>
        <article className="stat-item">
          <strong>100%</strong>
          <span>Komitmen Delivery</span>
        </article>
      </section>

      <section id="about" className="section-wrap about-section">
        <div className="section-head">
          <h2>Get to Know Me Better</h2>
        </div>
        <div className="about-grid">
          <article className="about-copy">
            <p>{profile.about}</p>
          </article>
          <aside className="about-photo-board">
            <div className="about-aurora" aria-hidden="true" />
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

      <section id="skills" className="section-wrap skills-section">
        <div className="section-head">
          <h2>Keahlian Teknis</h2>
        </div>
        <ul className="skills-flow">
          {(profile.stack || []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="services" className="section-wrap services-section">
        <div className="section-head">
          <h2>What I Do</h2>
          <p>Pendekatan kerja saya dalam membangun produk digital.</p>
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

      <section id="portfolio" className="section-wrap portfolio-section">
        <div className="section-head">
          <h2>Selected Projects</h2>
          <p>Tiap project sudah ada slot foto, silakan isi gambar project Anda nanti.</p>
        </div>
        <div className="project-grid">
          {(profile.projects || []).map((item, index) => (
            <article key={item.name} className="project-card">
              {item.image ? (
                <Image
                  className="project-thumb"
                  src={item.image}
                  alt={`Preview ${item.name}`}
                  width={600}
                  height={340}
                />
              ) : (
                <div className="project-thumb placeholder">
                  <div>
                    <strong>{item.name}</strong>
                    <span>{getDomain(item.url)}</span>
                  </div>
                </div>
              )}
              <div className="project-body">
                <div className="project-meta">
                  <span className="project-kind">{item.type || "Project"}</span>
                  <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.text}</p>
                <ul className="project-tech">
                  {(item.tech || ["Web", "Portfolio"]).map((tech) => (
                    <li key={`${item.name}-${tech}`}>{tech}</li>
                  ))}
                </ul>
                <div className="project-actions">
                  <a className="project-link project-link-live" href={item.url} target="_blank" rel="noreferrer">
                    View Details
                  </a>
                  <a
                    className="project-link"
                    href={item.github || profile.socials?.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="section-wrap contact-section">
        <div className="section-head">
          <h2>Let&apos;s Work Together</h2>
          <p>Kontak dibuat terpisah agar rapi dan mudah dibaca.</p>
        </div>
        <div className="contact-layout">
          <article className="contact-panel">
            <h3>Let&apos;s Talk</h3>
            <p>
              Punya project menarik atau kesempatan magang/PKL? Saya siap diskusi
              dan berkolaborasi untuk hasil terbaik.
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
              <h3>No. Telepon</h3>
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

      <section className="section-wrap pixel-showcase" aria-label="Pixel character showcase">
        <div className="section-head">
          <h2>Pixel Character</h2>
          <p>Mode karakter pixel diposisikan sebelum link media sosial.</p>
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

      <footer className="social-section">
        <p>Connect with me</p>
        <div className="social-links">
          <a
            className="social-badge"
            href={profile.socials?.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            title="Instagram"
          >
            <span>IG</span>
          </a>
          <a
            className="social-badge"
            href={profile.socials?.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <span>GH</span>
          </a>
          <a
            className="social-badge"
            href={profile.socials?.facebook}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            title="Facebook"
          >
            <span>FB</span>
          </a>
          <a
            className="social-badge"
            href={profile.socials?.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <span>IN</span>
          </a>
        </div>
        <p className="contact-note">
          Instagram • GitHub • Facebook • LinkedIn
        </p>
      </footer>

      </div>
    </main>
  );
}
