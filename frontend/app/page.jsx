"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import ParticleField from "../components/ParticleField";
import ProfileBoard from "../components/ProfileBoard";

const fallbackProfile = {
  name: "Ragah Dirotama Wijaya",
  tagline:
    "Full-stack Developer yang adaptif, progresif, dan berorientasi hasil untuk membangun produk digital modern.",
  about:
    "Saya adalah siswa PPLG SMKN 1 Ciomas yang fokus mengeksekusi ide menjadi aplikasi nyata, dari antarmuka yang responsif sampai API yang stabil dan aman. Saya terbiasa berkolaborasi dengan AI tools untuk mempercepat delivery tanpa mengorbankan kualitas.",
  stack: [
    "Frontend: React, Next.js, Tailwind CSS",
    "Backend: Node.js (Express), Laravel, Firebase",
    "Tools: Git, Vercel, Postman"
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
      text: "Terbukti mampu menuntaskan produk hingga tahap deployment dan siap digunakan publik."
    },
    {
      title: "Continuous Learner",
      text: "Konsisten mengasah skill full-stack sesuai kebutuhan industri dan tren teknologi terbaru."
    }
  ],
  projects: [
    {
      name: "Green Live Initiative (GLI)",
      text: "Mengubah konsep inisiatif lingkungan menjadi aplikasi web yang dapat diakses pengguna nyata."
    },
    {
      name: "Hungry Greens Salad",
      text: "Membangun platform bisnis makanan sehat dengan pengalaman pengguna yang bersih dan cepat."
    }
  ],
  quote:
    "Gapailah cita-cita hingga setinggi langit, sehingga dapat bermanfaat bagi diri kita dan orang lain.",
  photoUrl: "/images/profile-placeholder.svg",
  cvUrl: "/cv-ragah-dirotama-wijaya.txt",
  socials: {
    instagram: "https://instagram.com/",
    github: "https://github.com/Roschak",
    facebook: "https://facebook.com/",
    linkedin: "https://linkedin.com/"
  }
};

export default function HomePage() {
  const [profile, setProfile] = useState(fallbackProfile);

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

      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <header className="glass-nav">
        <a className="brand" href="#home">
          Ragah
        </a>
        <nav>
          <a href="#about">About</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <div className="side-name">RAGAH DIROTAMA WIJAYA</div>

      <section id="home" className="hero hero-grid">
        <article className="hero-copy glass-card">
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
            <a className="btn" href="#contact">
              Hubungi Saya
            </a>
          </div>
        </article>

        <aside className="hero-visual glass-card">
          <div className="photo-frame">
            <Image
              src={profile.photoUrl}
              alt="Foto profil Ragah Dirotama Wijaya"
              width={400}
              height={400}
              priority
            />
          </div>
          <h2>{profile.name}</h2>
          <p>SMKN 1 Ciomas • PPLG • Adaptive Builder</p>
        </aside>
      </section>

      <section className="quote-box glass-card">
        <p>{profile.quote}</p>
      </section>

      <section id="about">
        <ProfileBoard profile={profile} />
      </section>

      <section id="portfolio" className="portfolio-section glass-card">
        <div className="section-title">
          <h2>Selected Projects</h2>
          <p>Project nyata yang menunjukkan eksekusi, kualitas, dan dampak.</p>
        </div>
        <div className="project-grid">
          {(profile.projects || []).map((item) => (
            <article key={item.name} className="project-card">
              <h3>{item.name}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer id="contact" className="glass-footer">
        <p>Connect with me:</p>
        <div className="social-links">
          <a href={profile.socials?.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={profile.socials?.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.socials?.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a href={profile.socials?.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </footer>
    </main>
  );
}
