import "./globals.css";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import CookieBanner from "@/components/layout/CookieBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "PI² – Klarheit, Struktur, Fokus",
  description:
    "PI² ist eine Klarheits-Engine: Struktur, Fokus, Automatisierung und Cashflow-Transparenz in einem System.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-background text-text flex flex-col">
        <header className="border-b border-gray-200">
          <div className="container-wrapper flex items-center justify-between py-4">
            <Link href="/" className="font-serif text-2xl text-primary">
              PI²
            </Link>
            <nav className="flex items-center gap-6 text-sm text-gray-700">
              <Link href="/">Home</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/auth">Login</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-gray-200 bg-gray-50">
          <div className="container-wrapper flex flex-col gap-3 py-6 text-sm text-gray-700 md:flex-row md:items-center md:justify-between">
            <p className="font-serif text-primary">PI²</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/legal/impressum">Impressum</Link>
              <Link href="/legal/datenschutz">Datenschutz</Link>
              <Link href="/legal/agb">AGB</Link>
              <Link href="/legal/cookies">Cookies</Link>
              <Link href="/legal/security">Security</Link>
            </div>
          </div>
        </footer>

        <CookieBanner />
      </body>
    </html>
  );
}
