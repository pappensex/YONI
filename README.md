# PI²

PI² is a clarity-engine: structure, focus, automation, and cashflow visibility in one system.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Stripe (Checkout + Webhook skeleton)

## Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Run the development server
   ```bash
   npm run dev
   ```

## Build
```bash
npm run build
```

## Environment Variables
Copy `.env.example` to `.env.local` and provide values:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
DATABASE_URL=
```
