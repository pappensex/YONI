import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";

type DeployStatusItem = {
  id: string;
  task: string;
  status: string;
  comment: string;
};

export default function YoniDeployControlCenter() {
  const [statusData, setStatusData] = useState<DeployStatusItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("https://raw.githubusercontent.com/pihoch2/Transzendenz/main/Reports/Deploy-Status.md");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const text = await res.text();
      const parsed = parseStatusMarkdown(text);
      if (parsed.length === 0) {
        setErrorMessage("Keine Statusdaten gefunden.");
      }
      setStatusData(parsed);
      const done = parsed.filter((i) => i.status === "✅").length;
      const total = parsed.length;
      setProgress(total === 0 ? 0 : Math.round((done / total) * 100));
    } catch (err) {
      console.error("Status-Load-Error", err);
      setStatusData([]);
      setProgress(0);
      setErrorMessage("Status konnte nicht geladen werden. Bitte später erneut versuchen.");
    }
    setLoading(false);
  };

  const parseStatusMarkdown = (text: string): DeployStatusItem[] => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("|"));

    return lines.slice(2).reduce<DeployStatusItem[]>((acc, line, index) => {
      const cols = line.split("|").map((col) => col.trim());

      if (cols.length < 5) {
        return acc;
      }

      const [, id, task, status, comment = ""] = cols;

      acc.push({
        id: id || `item-${index}`,
        task: task || "Unbenannte Aufgabe",
        status: status || "❔",
        comment: comment || "",
      });

      return acc;
    }, []);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-center">
        🚀 YONI Deploy-Control-Center
      </h1>
      <div className="flex flex-col items-center space-y-2">
        <Progress value={progress} className="w-full h-3" />
        <p className="text-sm text-muted-foreground">
          Gesamtfortschritt: {progress}% abgeschlossen
        </p>
        <Button onClick={fetchStatus} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" /> {loading ? "Aktualisiere…" : "Sync jetzt"}
        </Button>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statusData.map((item) => (
          <Card
            key={item.id}
            className={`border-2 rounded-2xl shadow-md ${
              item.status === "✅"
                ? "border-green-500"
                : item.status === "⚙️"
                ? "border-yellow-400"
                : "border-red-500"
            }`}
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">{item.task}</h2>
                {item.status === "✅" && <CheckCircle className="text-green-500" />}
                {item.status === "⚙️" && <AlertTriangle className="text-yellow-500" />}
                {item.status === "❌" && <XCircle className="text-red-500" />}
              </div>
              <p className="text-sm text-muted-foreground">{item.comment}</p>
            </CardContent>
          </Card>
        ))}
        {!loading && !errorMessage && statusData.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 text-center text-sm text-muted-foreground">
            Keine Statusdaten verfügbar.
          </div>
        )}
      </div>
    </div>
  );
}
