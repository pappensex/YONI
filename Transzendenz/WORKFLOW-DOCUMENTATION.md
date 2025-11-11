# Workflow Dokumentation

## Verfügbare Workflows

### 1. CI for YONI (main.yml)
**Zweck:** Kontinuierliche Integration für das YONI-Projekt

**Trigger:**
- Automatisch bei Push auf `main` oder `releases/*` Branches
- Automatisch bei Pull Requests zu `main`
- **Manuell über GitHub UI** (workflow_dispatch)

**Schritte:**
1. Repository auschecken
2. Node.js 20 einrichten
3. Dependencies installieren
4. Linter ausführen (falls vorhanden)
5. Tests ausführen (falls vorhanden)
6. Projekt bauen (falls vorhanden)
7. Build-Artefakte hochladen

**Manuelles Starten:**
1. Navigiere zu: `https://github.com/pappensex/YONI-app/actions`
2. Wähle "CI for YONI (x148)" aus der Liste
3. Klicke auf "Run workflow"
4. Wähle den Branch aus
5. Klicke auf "Run workflow" Button

---

### 2. YONI Deploy Snapshot (deploy_snapshot.yml)
**Zweck:** Tägliche Snapshots des Deploy-Status erstellen und per E-Mail versenden

**Trigger:**
- Automatisch täglich um Mitternacht (cron: "0 0 * * *")
- **Manuell über GitHub UI** (workflow_dispatch)

**Schritte:**
1. Repository auschecken
2. Node.js 20 einrichten
3. Tägliche Snapshot-Datei generieren
4. Snapshot committen und pushen
5. HTML-E-Mail rendern
6. E-Mail-Benachrichtigung senden

**Benötigte Secrets:**
- `MAIL_USER`: Gmail-Benutzername
- `MAIL_PASS`: Gmail App-Passwort
- `MAIL_TO`: Empfänger-E-Mail-Adresse

**Voraussetzungen:**
- `Transzendenz/Reports/Deploy-Status.md` muss existieren ✅
- `Transzendenz/Reports/snapshot-log.txt` wird automatisch erstellt ✅

**Manuelles Starten:**
1. Navigiere zu: `https://github.com/pappensex/YONI-app/actions`
2. Wähle "📦 YONI Deploy Snapshot" aus der Liste
3. Klicke auf "Run workflow"
4. Wähle den Branch aus
5. Klicke auf "Run workflow" Button

---

## Status-Dateien

### Deploy-Status.md
Enthält den aktuellen Status aller Deployment-Tasks in Tabellenform:

```markdown
| ID | Task | Status | Comment |
|----|------|--------|---------|
| 001 | Repository Setup | ✅ | Repository initialized |
| 002 | CI/CD Pipeline | ⚙️ | In progress |
```

**Status-Symbole:**
- ✅ = Abgeschlossen
- ⚙️ = In Bearbeitung
- ❌ = Fehlgeschlagen

### snapshot-log.txt
Protokolliert alle Snapshot-Ereignisse mit Zeitstempel.

---

## Fehlerbehebung

### "File not found" Fehler im deploy_snapshot workflow
**Lösung:** Die Dateien `Transzendenz/Reports/Deploy-Status.md` und `snapshot-log.txt` wurden erstellt.

### E-Mail-Benachrichtigungen funktionieren nicht
**Lösung:** Stelle sicher, dass folgende Secrets in GitHub konfiguriert sind:
- MAIL_USER
- MAIL_PASS
- MAIL_TO

### Workflow kann nicht manuell gestartet werden
**Lösung:** Beide Workflows haben jetzt `workflow_dispatch` Trigger und können über die Actions-Seite manuell gestartet werden.
