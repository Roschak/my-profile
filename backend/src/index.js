const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

const profile = {
  name: "Ragah Dirotama Wijaya",
  tagline:
    "Full-stack Developer adaptif dan progresif yang membangun produk digital modern dari ide hingga live deployment.",
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
      text: "Platform inisiatif lingkungan dengan pengalaman pengguna yang responsif dan modern.",
      url: "https://gli-project-web.web.app"
    },
    {
      name: "Hungry Greens Salad",
      text: "Web app bisnis makanan sehat dengan performa cepat dan UI clean.",
      url: "https://hungrygreenssalad-v2.vercel.app"
    }
  ],
  quote:
    "Gapailah cita-cita setinggi langit, lalu jadilah manfaat bagi diri sendiri dan orang lain.",
  quoteAuthor: "~Ragah. D. Wijaya",
  photoUrl: "/images/profile-placeholder.svg",
  cvUrl: "/cv-ragah-dirotama-wijaya.txt",
  socials: {
    instagram: "https://www.instagram.com/roschak_rk",
    github: "https://github.com/Roschak",
    facebook: "https://www.facebook.com/share/1HtcbQvqGJ/",
    linkedin: "https://www.linkedin.com/in/ragah-dirotama-wijaya-38303b30b"
  }
};

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https://"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://"],
        fontSrc: ["'self'", "data:", "https://fonts.googleapis.com", "https://fonts.gstatic.com"]
      }
    }
  })
);
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
    credentials: true
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

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Endpoint not found",
    path: req.path,
    method: req.method
  });
});

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
    console.log(`Available endpoints:`);
    console.log(`  GET http://localhost:${port}/api/health`);
    console.log(`  GET http://localhost:${port}/api/profile`);
  });
}

module.exports = app;
