"use client";

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
  ]
};

export default function HomePage() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [apiStatus, setApiStatus] = useState("offline");

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
        setProfile(data.profile);
        setApiStatus("online");
      } catch (error) {
        setApiStatus("offline");
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

      <section className="hero">
        <p className="status-line">
          API backend: <span className={`status ${apiStatus}`}>{apiStatus}</span>
        </p>
        <h1>
          Membangun Produk Digital dengan Sentuhan Modern, Cepat, dan Siap Scale.
        </h1>
        <p>
          Saya menggabungkan mindset engineering, desain fungsional, dan eksekusi
          yang disiplin untuk menghadirkan pengalaman web yang solid.
        </p>
      </section>

      <ProfileBoard profile={profile} />
    </main>
  );
}
