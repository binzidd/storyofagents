import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The AI Evolution | Story of Agents",
  description: "The evolution of Generative AI—from transformers to autonomous agent networks. A strategic briefing for finance leaders.",
  openGraph: {
    title: "The AI Evolution | Story of Agents",
    description: "From ChatGPT to multi-agent networks—the strategic AI briefing for finance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
