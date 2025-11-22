"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "pi2-cookie-consent";

type Choice = "necessary" | "all";

export default function CookieBanner() {
  const [choice, setChoice] = useState<Choice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as Choice | null;
    if (stored) {
      setChoice(stored);
    }
  }, []);

  const handleChoice = (value: Choice) => {
    setChoice(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
  };

  if (choice) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-40">
      <div className="container-wrapper">
        <div className="rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-700">
              Wir verwenden Cookies für grundlegende Funktionalität und – nur mit deiner Zustimmung – für Analyse.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleChoice("necessary")}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
              >
                Nur notwendige Cookies
              </button>
              <button
                type="button"
                onClick={() => handleChoice("all")}
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
