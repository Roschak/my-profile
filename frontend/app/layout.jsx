import "./globals.css";
import { Providers } from "./providers";
import SmoothScroll from "../components/SmoothScroll";
import ParticlesBackground from "../components/ParticlesBackground";

import { Cinzel, Inter, JetBrains_Mono, Space_Grotesk, Orbitron } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-jetbrains-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
});

export const metadata = {
  title: "Ragah Dirotama Wijaya | Full-stack Developer",
  description:
    "Portfolio Ragah Dirotama Wijaya — Full-stack Developer yang membangun produk digital modern dari ide hingga deployment.",
  keywords: ["portfolio", "full-stack developer", "web developer", "React", "Next.js"],
  authors: [{ name: "Ragah Dirotama Wijaya" }],
  openGraph: {
    title: "Ragah Dirotama Wijaya | Full-stack Developer",
    description: "Portfolio Ragah Dirotama Wijaya — Full-stack Developer.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${cinzel.variable} ${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} ${orbitron.variable}`}
    >
      <body>
        <Providers>
          <ParticlesBackground />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
