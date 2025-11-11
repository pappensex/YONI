# Copilot PR Import Anleitung

Diese Anleitung beschreibt den Workflow zum Importieren von Pull Requests aus dem `copilot/tasks` Repository in das YONI-App Repository.

## Workflow

### 1. Branch vorbereiten

Wechseln Sie in den Codespace von `pappensex/YONI-app` und führen Sie folgende Befehle aus:

```bash
git fetch origin
git checkout -b import/copilot-pr-<NUMMER>
```

Ersetzen Sie `<NUMMER>` mit der tatsächlichen PR-Nummer aus dem copilot/tasks Repository.

### 2. Patch herunterladen und anwenden

```bash
# Patch von GitHub PR herunterladen
curl -L https://github.com/copilot/tasks/pull/<NUMMER>.patch -o /tmp/copilot.patch

# Patch mit git am anwenden (bewahrt Autoren/Commits)
git am /tmp/copilot.patch
```

### 3. Alternative bei Problemen

Falls `git am` fehlschlägt (z.B. bei Merge-Konflikten), können Sie alternativ `git apply` verwenden:

```bash
git apply /tmp/copilot.patch && git add -A && git commit -m "import: copilot/tasks PR <NUMMER>"
```

## Hinweise

- **git am**: Bevorzugte Methode, da sie die Original-Autoren und Commit-Nachrichten beibehält
- **git apply**: Fallback-Methode, die den Patch als einen neuen Commit mit Ihnen als Autor anlegt
- Stellen Sie sicher, dass die PR-Nummer korrekt ist, bevor Sie die Befehle ausführen
- Nach dem Import sollten Sie die Änderungen überprüfen und testen

## Beispiel

Für PR #123 aus copilot/tasks:

```bash
git fetch origin
git checkout -b import/copilot-pr-123
curl -L https://github.com/copilot/tasks/pull/123.patch -o /tmp/copilot.patch
git am /tmp/copilot.patch
```
