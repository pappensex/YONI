import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const moduleCards = [
  {
    title: "CORE",
    description: "Aufgaben, Notizen, Kalender (Platzhalter)",
  },
  {
    title: "FLOW",
    description: "Automationen (If → Then Flows)",
  },
  {
    title: "MONEY",
    description: "Cashflow & Reports",
  },
  {
    title: "SPACE",
    description: "physische und digitale Ordnung",
  },
  {
    title: "ENERGY",
    description: "Routinen, Fokus, Energie-Management",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      <section className="container-wrapper pt-14">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <p className="font-serif text-sm uppercase tracking-[0.18em] text-gray-500">
              Klarheit. Struktur. Fokus.
            </p>
            <h1 className="font-serif text-4xl leading-tight text-text md:text-5xl">
              PI² – Das System, das Klarheit erzeugt.
            </h1>
            <p className="text-lg text-gray-700">
              Struktur. Fokus. Automatisierung. Ohne Lärm.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/auth" className="px-5 py-3 text-base">
                Jetzt anmelden
              </Button>
              <Button variant="secondary" href="#first-100" className="px-5 py-3 text-base">
                First-100 Zugang sichern
              </Button>
            </div>
          </div>
          <Card className="space-y-4 border-primary/10 bg-primary/5 p-8">
            <p className="text-sm uppercase tracking-[0.14em] text-primary">Was PI² löst</p>
            <ul className="space-y-2 text-gray-800">
              <li>• mental load</li>
              <li>• Chaos und Überforderung</li>
              <li>• fehlende Struktur im Alltag und Business</li>
              <li>• intransparenter Cashflow</li>
              <li>• keine Automationen, alles manuell</li>
            </ul>
          </Card>
        </div>
      </section>

      <section className="container-wrapper space-y-6">
        <div className="flex items-baseline justify-between">
          <h2 className="section-title">Die Module</h2>
          <span className="text-sm text-gray-600">Struktur für jeden Bereich.</span>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {moduleCards.map((module) => (
            <Card key={module.title} className="p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{module.title}</p>
              <h3 className="mt-3 text-xl font-semibold text-text">{module.title}</h3>
              <p className="mt-2 text-gray-700">{module.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="first-100" className="container-wrapper">
        <Card className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">First 100</p>
            <h2 className="text-2xl font-serif text-text md:text-3xl">Die ersten 100 Nutzer:innen erhalten:</h2>
            <ul className="space-y-2 text-gray-700">
              <li>– Early Access</li>
              <li>– priorisierte Feature-Freischaltungen</li>
              <li>– direkten Support</li>
              <li>– Launch-Preis</li>
            </ul>
          </div>
          <Button className="px-6 py-3 text-base">Jetzt eintragen</Button>
        </Card>
      </section>
    </div>
  );
}
