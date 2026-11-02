import type { Metadata } from "next";
import { JetBrains_Mono, Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({ variable: "--font-rajdhani", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const orbitron = Orbitron({ variable: "--font-orbitron", subsets: ["latin"], weight: ["500", "700", "900"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Athul Babu Teeyancheri | Full Stack Developer",
  description:
    "Portfolio of Athul Babu Teeyancheri, a Full Stack Software Developer (React, Node.js, Ruby on Rails) based in Ontario, Canada.",
  openGraph: {
    title: "Athul Babu Teeyancheri | Full Stack Developer",
    description: "React, Node.js and Rails developer based in Ontario, Canada.",
    images: ["/media/guide-portrait.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${orbitron.variable} ${jetbrains.variable} antialiased`}>
      <body className="min-h-svh font-sans">{children}</body>
    </html>
  );
}
