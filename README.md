# ✨ YONI – Überhochglitzer App

> 🟣 Ein sicherer, liebevoller Raum für mentale Gesundheit – digital, fachärztlich begleitet und technisch perfekt.

![YONI Banner](https://user-images.githubusercontent.com/placeholder/banner.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?logo=next.js)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Styled%20with-TailwindCSS-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)
[![Accessibility](https://img.shields.io/badge/A11y-AA%2B-2ECC71)](#)

---

## 🌌 Mission

**YONI** ist eine Online-Selbsthilfegruppe für psychisch belastete Menschen  
mit **fachärztlicher Begleitung, digitaler Sicherheit und liebevoller Gestaltung**.

**🔞 Altersfreigabe: 18+** – YONI richtet sich an erwachsene Nutzer:innen.

Die App vereint:

- 🤝 **Gemeinschaft** – Chat-Räume & Themenkreise mit Peer-Mentor:innen
- 🧠 **Fachliche Supervision** – Ärzt:innen, Therapeut:innen, geschützte Q&A
- 🪞 **Selbstwirksamkeit** – Tools für Reflexion, Stimmung & Achtsamkeit
- 🌈 **Überhochglitzer-Design** – kosmisch, heilend, barrierefrei, technisch präzise
- ✨ **GODDESSMODE+** – Erweiterte visuelle Effekte für ein intensiveres Erlebnis

---

## ⚙️ Tech Stack

| Layer      | Technologie                             | Beschreibung                            |
| ---------- | --------------------------------------- | --------------------------------------- |
| Frontend   | **Next.js 14**                          | App Router, SSR, optimierte Performance |
| Styling    | **TailwindCSS + Überhochglitzer Theme** | Tokens, Animation, Starfield            |
| Backend    | **API Routes (Edge Functions)**         | Stripe, GitHub Webhooks, Chat           |
| Deployment | **Vercel**                              | Preview + Production CI/CD              |
| Monitoring | **Lighthouse CI, axe-core**             | A11y, Performance, QA Checks            |

---

## 🛠️ Install, Run & Build

> Voraussetzung: **Node.js 18.17+** (siehe `package.json`).

1. **Dependencies installieren**
   ```bash
   npm install
   ```
2. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```
3. **Produktions-Build erstellen**
   ```bash
   npm run build
   ```
4. **Build lokal testen**
   ```bash
   npm run start
   ```

Für weitere Details siehe auch die lokalen Guides im Repository (z. B. `YONI_Local_Run_Guide.md`).

---

## 🚀 NextAuth + Google OAuth Auto-Setup

1. **Google OAuth-Client anlegen**
   - Gehe zu https://console.cloud.google.com/apis/credentials → "Create OAuth Client ID" → Web Application.
   - Origins: `http://localhost:3000` (plus deine Domain, z. B. `https://DEINE-DOMAIN.com`).
   - Redirect URIs: `http://localhost:3000/api/auth/callback/google` (plus `https://DEINE-DOMAIN.com/api/auth/callback/google`).
   - Kopiere `GOOGLE_CLIENT_ID` und `GOOGLE_CLIENT_SECRET`.
2. **Auto-Installer ausführen**
   ```bash
   npm run setup:google-auth
   ```
   - Erstellt/aktualisiert `.env.local` mit Platzhaltern und einem generierten `NEXTAUTH_SECRET`.
   - Legt die Route `app/api/auth/[...nextauth]/route.ts` mit Google-Provider an.
3. **.env.local vervollständigen**
   - Ersetze die Platzhalter für `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`.
   - Setze `NEXTAUTH_URL` bei Deployments (z. B. `https://DEINE-DOMAIN.com`).
4. **Dependency sicherstellen**
   - Stelle sicher, dass `next-auth` installiert ist (`npm install`), falls dein lokales Setup keinen Zugriff auf das Paket hatte.
5. **Login testen**
   - `npm run dev` starten und `http://localhost:3000/api/auth/signin` öffnen → Google auswählen → zurück zur App.

Fehlerhilfe: 400 = Redirect-URI-Mismatch, 403 = App im Testing Mode (E-Mail whitelisten), "Missing NEXTAUTH_URL/Secret" = `.env.local` prüfen.

---

## 🧩 Design Tokens & Theme

| Token            | Wert      | Bedeutung                               |
| ---------------- | --------- | --------------------------------------- |
| `brand.amethyst` | `#9966CC` | Hoffnung, Spiritualität, Transformation |
| `text.starwhite` | `#F5F5F5` | Klarheit und Licht im Dunkeln           |
| `ok.emerald`     | `#2ECC71` | Heilung und Wachstum                    |
| `hl.gold`        | `#FFD700` | Wärme, Wert und Verbundenheit           |

---

## 🚀 Getting Started

### Lokale Entwicklung

```bash
git clone https://github.com/pappensex/YONI-app.git
cd YONI-app
npm install
npm run dev
```

Die App ist dann verfügbar unter: **http://localhost:3000**

Siehe [YONI_Local_Run_Guide.md](YONI_Local_Run_Guide.md) für Details.

### iPhone-Demo / Testversand

- 📱 **Homescreen-Installation:** Safari → Teilen → „Zum Home-Bildschirm".
- 📤 **Preview verschicken:** Anleitung siehe [IOS_DEMO_GUIDE.md](IOS_DEMO_GUIDE.md).

### Deployment

Siehe **[DEPLOYMENT.md](DEPLOYMENT.md)** für vollständige Deployment-Anleitung:

- 🤖 Automatisches Deployment via GitHub Actions
- 💻 Manuelles Deployment via Vercel CLI
- 🌐 Domain-Konfiguration (pihoch2.me, www, app, api)
- 🔒 Umgebungsvariablen

**Quick Domain Setup:**

```bash
# Domain-Setup-Script ausführen
npm run domains:setup:dry-run  # Vorschau
npm run domains:setup          # Domains hinzufügen
```

---

## 💜 Contributing

1. Fork das Repo
2. Erstelle einen Feature-Branch: `git checkout -b feature/dein-thema`
3. Führe `npm run lint && npm run build` aus
4. Erstelle einen Pull-Request ✨

Siehe [CONTRIBUTING.md](CONTRIBUTING.md) für Details.

### CI Checks

- ✅ ESLint + TypeScript
- ✅ A11y (axe)
- ✅ Lighthouse ≥ 95
- ✅ Duplicate Route Guard

---

## 🧘‍♀️ Lizenz & Verantwortung

Dieses Projekt ist **Open Source (MIT)**.  
Es ersetzt **keine Therapie**.  
YONI versteht sich als digitaler Begleiter auf dem Weg zur Heilung,  
nicht als medizinisches Produkt.

---

## 🔮 Kontakt & Links

**Projektleitung:** [@pappensex](https://github.com/pappensex)  
**Website:** [yoni.pihoch2.me](https://yoni.pihoch2.me)  
**Demo:** [yoni.vercel.app](https://yoni.vercel.app)  
**Mail:** [yoni@pihoch2.me](mailto:yoni@pihoch2.me)

---

> _„Im Dunkel des Alls glitzert jeder Mensch als eigene Galaxie."_
