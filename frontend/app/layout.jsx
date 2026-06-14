import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Ragah Dirotama Wijaya | Full-stack Developer",
  description:
    "Portfolio Ragah Dirotama Wijaya — Full-stack Developer adaptif dan progresif yang membangun produk digital modern.",
  keywords: ["portfolio", "full-stack developer", "web developer", "React", "Next.js"],
  authors: [{ name: "Ragah Dirotama Wijaya" }],
  openGraph: {
    title: "Ragah Dirotama Wijaya | Full-stack Developer",
    description:
      "Portfolio Ragah Dirotama Wijaya — Full-stack Developer adaptif dan progresif.",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Preconnect for Google Fonts performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
