const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

const profile = {
  name: "Ragah Dirotama Wijaya",
  tagline:
    "Adaptive and progressive Full-stack Developer yang membangun aplikasi modern dari ide sampai live deployment.",
  about:
    "Saya adalah Full-stack Developer yang menggabungkan kecepatan eksekusi, disiplin engineering, dan orientasi hasil untuk menghasilkan produk digital yang relevan. Berbekal pengalaman pada React, Tailwind CSS, Node.js (Express), Laravel, dan Firebase, saya terbiasa menangani alur pengembangan end-to-end. Saya juga memiliki mindset secure development sehingga aplikasi yang saya bangun tidak hanya cepat, tetapi juga lebih kokoh menghadapi risiko keamanan dasar.",
  stack: [
    "Frontend: React, Next.js, Tailwind CSS",
    "Backend: Node.js (Express), Laravel, Firebase",
    "Tools: Git, Vercel, Postman"
  ],
  strengths: [
    {
      title: "High Adaptability",
      text: "Mampu beradaptasi cepat dengan teknologi baru dan kolaborasi AI untuk mempercepat workflow."
    },
    {
      title: "Secure Development Mindset",
      text: "Memahami dasar keamanan jaringan dan aplikasi web untuk membangun sistem yang lebih tangguh."
    },
    {
      title: "Result-Oriented",
      text: "Berpengalaman mengubah ide menjadi produk online yang dapat diakses publik."
    },
    {
      title: "Continuous Improvement",
      text: "Konsisten belajar dan meningkatkan standar kualitas agar selaras dengan kebutuhan industri."
    }
  ],
  projects: [
    {
      name: "Green Live Initiative (GLI)",
      text: "Merealisasikan konsep aplikasi inisiatif lingkungan menjadi platform web yang siap diakses pengguna."
    },
    {
      name: "Hungry Greens Salad",
      text: "Membangun aplikasi untuk bisnis makanan sehat dengan fokus pada experience dan performa."
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

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*"
  })
);

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "profil-ragah-backend",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/profile", (req, res) => {
  res.json({
    ok: true,
    profile
  });
});

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}

module.exports = app;
