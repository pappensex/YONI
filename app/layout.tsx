import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'YONI • pi² Control (Vercel‑Min)',
  description: 'YONI: Creator‑KI, Auto‑Translate, Transzendenz‑Hub. Minimal Flat Build für Vercel.',
  themeColor: '#0a0a0a',
  manifest: '/manifest.webmanifest',
  icons: {
    apple: '/icon-192.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
