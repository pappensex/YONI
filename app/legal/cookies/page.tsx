import fs from "fs";
import path from "path";
import { Card } from "@/components/ui/card";

export default function CookiesPage() {
  const content = fs.readFileSync(path.join(process.cwd(), "legal", "cookies.md"), "utf-8");

  return (
    <div className="container-wrapper py-12">
      <Card className="prose max-w-3xl whitespace-pre-line p-8 text-gray-800">
        <h1 className="mb-4 text-3xl font-serif text-text">Cookies</h1>
        <div className="space-y-2 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br />") }} />
      </Card>
    </div>
  );
}
