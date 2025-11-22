import { Card } from "@/components/ui/card";

const modules = [
  { title: "CORE", detail: "3 Aufgaben heute" },
  { title: "FLOW", detail: "Automationen in Vorbereitung" },
  { title: "MONEY", detail: "Cashflow Übersicht (Demo)" },
  { title: "SPACE", detail: "Bereich: Wohnzimmer – Status: in Bearbeitung" },
  { title: "ENERGY", detail: "Gewohnheit: Fokus 25 min" },
];

export default function DashboardPage() {
  return (
    <div className="container-wrapper space-y-10 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-serif text-text">Dashboard</h1>
        <p className="text-gray-600">Heute – dein Fokusbereich und Module im Überblick.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-text">Heute</h2>
        <p className="mt-2 text-gray-700">Placeholder: Tagesfokus, Termine und wichtigste Aufgaben.</p>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.title} className="p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{module.title}</p>
            <h3 className="mt-3 text-xl font-semibold text-text">{module.title}</h3>
            <p className="mt-2 text-gray-700">{module.detail}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
