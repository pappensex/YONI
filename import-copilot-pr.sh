#!/usr/bin/env bash

# ═══════════════════════════════════════════════════════════════════════════════
# YONI - Copilot PR Import Script
# ═══════════════════════════════════════════════════════════════════════════════
# Dieses Skript automatisiert den Import von Patches aus Copilot Task PRs.
#
# Verwendung:
#   ./import-copilot-pr.sh <PR_NUMMER>
#
# Beispiel:
#   ./import-copilot-pr.sh 123
#
# Das Skript:
#   1. Fetched von origin
#   2. Erstellt einen Branch import/copilot-pr-<NUMMER>
#   3. Lädt den Patch herunter
#   4. Prüft auf Konflikte
#   5. Wendet den Patch an (mit Autorenhistorie)
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funktion für farbige Ausgabe
log_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

log_success() {
    echo -e "${GREEN}✓ ${NC}$1"
}

log_warning() {
    echo -e "${YELLOW}⚠ ${NC}$1"
}

log_error() {
    echo -e "${RED}✗ ${NC}$1"
}

# Hilfefunktion
show_usage() {
    cat << EOF
Verwendung: $0 <PR_NUMMER>

Importiert einen Patch aus einem Copilot Task PR.

Argumente:
  PR_NUMMER    Die Nummer des Copilot Task PRs

Beispiel:
  $0 123

Das Skript erstellt einen neuen Branch 'import/copilot-pr-<NUMMER>' und
wendet den Patch mit erhaltener Autorenhistorie an.
EOF
    exit 1
}

# Prüfe Argumente
if [ $# -eq 0 ]; then
    log_error "Keine PR-Nummer angegeben"
    show_usage
fi

PR_NUMBER="$1"

# Validiere PR-Nummer (nur Zahlen)
if ! [[ "$PR_NUMBER" =~ ^[0-9]+$ ]]; then
    log_error "Ungültige PR-Nummer: '$PR_NUMBER' (nur Zahlen erlaubt)"
    exit 1
fi

BRANCH_NAME="import/copilot-pr-${PR_NUMBER}"
PATCH_URL="https://github.com/copilot/tasks/pull/${PR_NUMBER}.patch"
PATCH_FILE="/tmp/copilot-${PR_NUMBER}.patch"

log_info "Starte Import von Copilot PR #${PR_NUMBER}"
echo

# Schritt 1: Fetch von origin
log_info "Schritt 1/5: Fetch von origin..."
if git fetch origin; then
    log_success "Origin erfolgreich gefetched"
else
    log_error "Fetch von origin fehlgeschlagen"
    exit 1
fi
echo

# Schritt 2: Branch erstellen
log_info "Schritt 2/5: Erstelle Branch '${BRANCH_NAME}'..."
if git checkout -b "${BRANCH_NAME}" 2>/dev/null; then
    log_success "Branch '${BRANCH_NAME}' erstellt und ausgecheckt"
elif git checkout "${BRANCH_NAME}" 2>/dev/null; then
    log_warning "Branch '${BRANCH_NAME}' existiert bereits, wurde ausgecheckt"
else
    log_error "Konnte Branch nicht erstellen oder auschecken"
    exit 1
fi
echo

# Schritt 3: Patch herunterladen
log_info "Schritt 3/5: Lade Patch herunter von ${PATCH_URL}..."
if curl -L -f -s "${PATCH_URL}" -o "${PATCH_FILE}"; then
    log_success "Patch erfolgreich heruntergeladen nach ${PATCH_FILE}"
    # Zeige erste paar Zeilen des Patches
    log_info "Patch-Vorschau:"
    head -n 10 "${PATCH_FILE}" | sed 's/^/  /'
else
    log_error "Fehler beim Herunterladen des Patches"
    log_error "URL: ${PATCH_URL}"
    log_error "Bitte prüfe, ob die PR-Nummer korrekt ist"
    exit 1
fi
echo

# Schritt 4: Konflikte prüfen
log_info "Schritt 4/5: Prüfe auf Konflikte..."
if git apply --check "${PATCH_FILE}" 2>/dev/null; then
    log_success "Keine Konflikte erkannt, Patch kann angewendet werden"
else
    log_warning "Konfliktprüfung mit 'git apply --check' ergab Warnungen"
    log_info "Versuche trotzdem mit 'git am' fortzufahren..."
fi
echo

# Schritt 5: Patch anwenden
log_info "Schritt 5/5: Wende Patch an (mit Autorenhistorie)..."
if git am "${PATCH_FILE}"; then
    log_success "Patch erfolgreich angewendet!"
    echo
    log_success "═══════════════════════════════════════════════════════════"
    log_success "Import erfolgreich abgeschlossen!"
    log_success "═══════════════════════════════════════════════════════════"
    echo
    log_info "Aktuelle Branch: ${BRANCH_NAME}"
    log_info "Letzte Commits:"
    git log --oneline -3
    echo
    log_info "Nächste Schritte:"
    echo "  1. Prüfe die Änderungen mit: git log -p"
    echo "  2. Push zum Remote mit: git push origin ${BRANCH_NAME}"
    echo "  3. Erstelle einen Pull Request auf GitHub"
else
    log_error "═══════════════════════════════════════════════════════════"
    log_error "Fehler beim Anwenden des Patches"
    log_error "═══════════════════════════════════════════════════════════"
    echo
    log_info "Mögliche Lösungen:"
    echo "  1. Konflikte manuell lösen:"
    echo "     git status                # Zeige konfliktbehaftete Dateien"
    echo "     # Bearbeite die Dateien manuell"
    echo "     git add -A               # Stage alle Änderungen"
    echo "     git am --continue        # Fortsetzen"
    echo
    echo "  2. Import abbrechen:"
    echo "     git am --abort           # Verwerfe den Patch"
    echo "     git checkout main        # Zurück zu main"
    echo "     git branch -D ${BRANCH_NAME}  # Lösche den Branch"
    exit 1
fi

# Aufräumen
rm -f "${PATCH_FILE}"
log_info "Temporäre Patch-Datei entfernt"
