# AION Revenue Engine

Null-Budget-System für die kontrollierte Entwicklung, Prüfung und Validierung digitaler Umsatzangebote.

## Was Version 0.3 bereits macht

- entwickelt und bewertet eine eng gefasste Geschäftschance;
- trennt KI-Analyse von deterministischer Freigabelogik;
- erzeugt ein komplettes lokales Verkaufspaket;
- bereitet Landingpage, Angebot, Outreach und Sieben-Tage-Experiment vor;
- blockiert externe Aktionen in einer Freigabe-Warteschlange;
- erzeugt aus Website-Text einen priorisierten, kundenfertigen Audit-Bericht;
- misst Antworten, Verkäufe, Umsatz, Kosten und Gewinn;
- stoppt Experimente, die Geld kosten oder keine Nachfrage zeigen.

## Sicherheitsmodell

Automatisch erlaubt sind nur **lokale, reversible Null-Budget-Aktionen ohne Außenwirkung**.

Immer freigabepflichtig sind:

- Veröffentlichung;
- Versand von Nachrichten;
- Zahlungs- oder Kontokonfiguration;
- Ausgaben;
- Verarbeitung personenbezogener Daten;
- Verträge und rechtliche Verpflichtungen;
- Löschen, Überschreiben oder andere irreversible Änderungen.

Der Kritik-Agent bewertet diese Aktionen vorab. Die finale Schranke bleibt deterministischer Code.

## Offline starten

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
python main.py --build-demo
python main.py --audit-file data/sample_website.txt \
  --business-name "Mustermann Gebäudeservice" \
  --primary-offer "Gebäudeservice" \
  --desired-customer "Hausverwaltungen und Eigentümer"
pytest
```

Die fertigen Assets liegen danach unter:

```text
generated/landingpage-audit/
├── index.html
├── control-center.html
├── audit-report.html
├── revenue-pack.json
├── outreach.md
├── experiment.md
└── approval-queue.json
```

Lokale Vorschau:

```bash
PORT=8000 python main.py
# anschließend /demo öffnen
```

## Live-Agentenlauf

Nur mit einem **frischen, sicher hinterlegten** Schlüssel:

```bash
export OPENAI_API_KEY='...'
export AION_MODEL='gpt-5-mini'
python main.py --build 'Find one zero-budget digital service for German small businesses.'
```

Der früher im Chat veröffentlichte Schlüssel darf nicht verwendet werden.

## API

- `GET /health`
- `GET /demo`
- `GET /demo/pack`
- `POST /evaluate`
- `POST /build`
- `POST /experiments/evaluate`
- `POST /audits/from-text`

## Umsatzkandidat 001

**Klartext Website-Audit** für lokale Dienstleister.

- Validierungspreis: 29 Euro
- späterer Standardpreis: 79 Euro
- kein Website-Zugang erforderlich
- keine Erfolgs- oder Umsatzgarantie
- Veröffentlichung, Outreach und Zahlungslink bleiben bis zur Freigabe gesperrt

## Entscheidungsfluss

```text
Opportunity
   ↓
Evidence + Risk
   ↓
Deterministic Revenue Policy
   ↓
Local Product Factory
   ↓
Critical Decision Reviewer
   ↓
Approval Queue
   ↓
Human approval for external side effects
   ↓
7-day validation
   ↓
Profit-based learn / scale / stop
```
