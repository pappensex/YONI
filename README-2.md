# PI²

PI² ist eine Klarheits-Engine: Struktur, Fokus, Automatisierung und Cashflow-Transparenz in einem System.

## Tech Stack

- Next.js (App Router)
- TypeScript
- React
- Tailwind CSS
- Stripe Checkout + Webhook (Skeleton)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Die App ist dann unter `http://localhost:3000` erreichbar.

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

Erstelle eine `.env.local` auf Basis von `.env.example`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
DATABASE_URL=
```

Wenn `STRIPE_SECRET_KEY` und `STRIPE_WEBHOOK_SECRET` nicht gesetzt sind, funktionieren die Stripe-Endpunkte nicht, der Rest der App jedoch weiterhin.

## Struktur

- `/app` – App Router Pages (Landing, Dashboard, Auth, Legal, API-Routen)
- `/components` – UI- und Layout-Komponenten
- `/lib` – Stripe-Client, DB-Placeholder, Typen
- `/legal` – rechtliche Inhalte (Markdown)
- `/styles` – Tailwind / globale Styles

Bereit für Deployment auf Vercel.
