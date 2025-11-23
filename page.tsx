import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import Link from "next/link";

const modules = [
  {
    key: "CORE",
    title: "CORE",
    subtitle: "Aufgaben, Notizen, Kalender",
    description: "Der zentrale Nervenknoten für deinen Alltag und dein Business."
  },
  {
    key: "FLOW",
    title: "FLOW",
    subtitle: "Automationen (If → Then Flows)",
    description: "Baue Abläufe, die für dich arbeiten – ohne manuelle Wiederholung."
  },
  {
    key: "MONEY",
    title: "MONEY",
    subtitle: "Cashflow & Reports",
    description: "Klarheit über Einnahmen, Ausgaben und deine nächsten Hebel."
  },
  {
    key: "SPACE",
    title: "SPACE",
    subtitle: "Physische und digitale Ordnung",
    description: "Räume, Dateien und Systeme – alles bekommt seinen Platz."
  },
  {
    key: "ENERGY",
    title: "ENERGY",
    subtitle: "Routinen, Fokus, Energie-Management",
    description:
      "Strukturen, die deine Energie schützen und auf das Wesentliche richten."
  }
];

export default function HomePage() {
  return (
    <>
      <Section>
        <Container className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
          <div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4">
              PI² – Das System, das Klarheit erzeugt.
            </h1>
            <p className="text-base md:text-lg text-black/70 mb-6 max-w-xl">
              Struktur. Fokus. Automatisierung. Ohne Lärm.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/auth">
                <Button variant="primary">Jetzt anmelden</Button>
              </Link>
              <Link href="#first-100">
                <Button variant="secondary">First-100 Zugang sichern</Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <Card className="bg-gradient-to-br from-primary/10 via-rosegold/10 to-gold/10">
              <p className="text-xs uppercase tracking-[0.2em] text-black/50 mb-3">
                Klarheits-Engine
              </p>
              <h2 className="font-display text-xl mb-2">
                Ein System, nicht noch ein „Tool“.
              </h2>
              <p className="text-sm text-black/70">
                PI² bündelt Aufgaben, Automationen, Cashflow und Ordnung in
                einem klaren Interface – damit du entscheiden kannst, statt nur
                zu reagieren.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="max-w-xl">
            <h2 className="font-display text-2xl mb-4">Was PI² löst</h2>
            <p className="text-sm text-black/70 mb-4">
              PI² adressiert die typischen Engpässe moderner Wissensarbeit und
              Selbstorganisation:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-black/80">
              <li>mental load</li>
              <li>Chaos und Überforderung</li>
              <li>fehlende Struktur im Alltag und Business</li>
              <li>intransparenter Cashflow</li>
              <li>keine Automationen, alles manuell</li>
            </ul>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="font-display text-2xl mb-6">Die Module</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((mod) => (
              <Card key={mod.key}>
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-black/50">
                  {mod.key}
                </div>
                <h3 className="font-display text-lg mb-1">{mod.title}</h3>
                <p className="text-xs text-primary/80 mb-3">{mod.subtitle}</p>
                <p className="text-sm text-black/75">{mod.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="first-100" className="bg-black/[0.02]">
        <Container className="max-w-2xl">
          <h2 className="font-display text-2xl mb-4">First 100</h2>
          <p className="text-sm text-black/80 mb-3">
            Die ersten 100 Nutzer:innen erhalten:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-black/80 mb-6">
            <li>Early Access</li>
            <li>priorisierte Feature-Freischaltungen</li>
            <li>direkten Support</li>
            <li>Launch-Preis</li>
          </ul>
          <Link href="/auth">
            <Button variant="primary">Jetzt eintragen</Button>
          </Link>
        </Container>
      </Section>
    </>
  );
}
