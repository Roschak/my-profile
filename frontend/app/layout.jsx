import "./globals.css";

export const metadata = {
  title: "Ragah Dirotama Wijaya | Full-stack Developer",
  description:
    "Portfolio profile Ragah Dirotama Wijaya - Full-stack Developer adaptif dan progresif."
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
