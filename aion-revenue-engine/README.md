# AION Revenue Engine

Null-Budget-System für die kontrollierte Entwicklung, Prüfung und Validierung digitaler Umsatzangebote.

## Enthalten

- Scout-, Evidence- und Risk-Agent über das OpenAI Agents SDK
- deterministische Revenue- und Freigabelogik
- harte Null-Budget-Regel
- menschliche Freigabe vor Veröffentlichung, Nachrichtenversand, Zahlungs- und Kontoänderungen, Kosten, Verträgen, personenbezogenen Daten und irreversiblen Aktionen
- Website-Audit als erstes verkaufbares Produkt
- FastAPI-Endpunkte und CLI
- automatisierte Kerntests

## Installation

```bash
cd aion-revenue-engine
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
pytest
```

## Lokalen Auditbericht erzeugen

```bash
python main.py \
  --audit-file data/sample_website.txt \
  --business-name "Mustermann Gebäudeservice" \
  --primary-offer "Gebäudeservice" \
  --desired-customer "Hausverwaltungen und Eigentümer" \
  --output generated/audit-report.html
```

## API starten

```bash
PORT=8000 python main.py
```

Endpunkte:

- `GET /health`
- `POST /actions/preflight`
- `POST /experiments/evaluate`
- `POST /audits/from-text`

## Live-Agenten

Live-Agenten benötigen einen frischen, sicher als Umgebungsvariable hinterlegten Schlüssel:

```bash
export OPENAI_API_KEY='...'
export AION_MODEL='gpt-5-mini'
```

API-Schlüssel gehören niemals in Chats, Quellcode, Commits oder ZIP-Dateien.

## Entscheidungsfluss

```text
Opportunity
   ↓
Scout + Evidence + Risk
   ↓
Deterministic Revenue Policy
   ↓
Local Prototype
   ↓
Preflight Approval Gate
   ↓
Human approval for external side effects
   ↓
Profit-based learn / scale / stop
```

## Umsatzkandidat 001

**Klartext Website-Audit für lokale Dienstleister**

- Validierungspreis: 29 Euro
- Standardpreis nach erfolgreicher Validierung: 79 Euro
- keine Erfolgs- oder Umsatzgarantie
- keine automatische Außenwirkung

## Status

Der Kern wurde direkt über die GitHub-Datei-API aufgebaut. Ein manueller Upload vom iPhone ist nicht erforderlich.
