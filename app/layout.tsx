import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'YONI • Überhochglitzer App',
  description: 'Ein sicherer, liebevoller Raum für mentale Gesundheit – digital, fachärztlich begleitet und technisch perfekt.',
  themeColor: '#0a0a0a',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon-192.png',
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
      <body className="bg-bg-dark text-text-starwhite">{children}</body>
    </html>
  )
}
