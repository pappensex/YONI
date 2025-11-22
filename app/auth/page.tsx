import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="container-wrapper py-12">
      <Card className="mx-auto max-w-xl space-y-6 p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-serif text-text">Anmelden</h1>
          <p className="text-gray-600">Sichere dir Zugang zu PI². Auth wird später angebunden.</p>
        </div>
        <div className="space-y-4 text-center">
          <Button className="w-full justify-center">Login mit E-Mail (Platzhalter)</Button>
          <p className="text-sm text-gray-600">
            Noch kein Konto? <Link href="#" className="text-primary">Registriere dich</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
