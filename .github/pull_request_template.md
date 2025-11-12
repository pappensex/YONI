# 🟣 YONI Pull Request

> **Titel:** Beschreibe die Änderung in einem Satz  
> **Typ:** [ ] 🐛 Bugfix | [ ] ✨ Feature | [ ] 📚 Docs | [ ] 🎨 Style | [ ] ♻️ Refactor | [ ] ⚡ Performance | [ ] 🔒 Security

---

## 📋 Beschreibung

<!-- Beschreibe was sich ändert und warum -->

### Problem / Motivation
<!-- Welches Problem wird gelöst? Welche User Story wird adressiert? -->

### Lösung
<!-- Wie wurde das Problem gelöst? Welcher Ansatz wurde gewählt? -->

### Screenshots / Demos
<!-- Falls UI-Änderungen: Screenshots vor/nach oder GIF/Video -->

---

## ✅ Checkliste

### Code Quality
- [ ] Code folgt dem bestehenden Stil und den Konventionen
- [ ] Keine unnötigen Kommentare oder Debug-Code
- [ ] Variablen und Funktionen haben aussagekräftige Namen
- [ ] Komplexe Logik ist dokumentiert

### Testing
- [ ] `npm run lint` läuft ohne Fehler
- [ ] `npm run build` ist erfolgreich
- [ ] Manuelle Tests durchgeführt (beschreibe in Kommentar)
- [ ] Edge Cases berücksichtigt
- [ ] Keine bestehenden Tests wurden entfernt oder beschädigt

### YONI Design Principles ✨
- [ ] 🟣 **Sicherheit**: Nutzer:innen-Daten sind geschützt (HTTPS, CSP, RBAC)
- [ ] 💜 **Würde**: Respektvoller Umgang mit sensiblen Themen
- [ ] 🌌 **Transzendenz**: Ästhetik folgt Überhochglitzer-Theme
- [ ] 🧠 **Kompetenz**: Medizinisch/technisch fundiert
- [ ] 🪶 **Leichtigkeit**: Barrierefrei, klar, einfach zu nutzen

### Security & Privacy
- [ ] Keine Secrets, API Keys oder Tokens im Code
- [ ] DSGVO-Compliance beachtet (falls relevant)
- [ ] Keine sensiblen Daten in Logs oder Fehlermeldungen
- [ ] Input-Validierung implementiert (falls user input)
- [ ] CodeQL/Security Scans berücksichtigt

### Accessibility (A11y)
- [ ] Semantisches HTML verwendet
- [ ] Farbkontraste erfüllen WCAG AA Standard
- [ ] Keyboard-Navigation funktioniert
- [ ] Screen-Reader-freundlich (aria-labels, alt-texte)
- [ ] Kein Flackern/Blitzen (Epilepsie-Schutz)

### Documentation
- [ ] README.md aktualisiert (falls nötig)
- [ ] API-Dokumentation erweitert (falls API-Änderungen)
- [ ] Kommentare für komplexe Funktionen
- [ ] CHANGELOG.md aktualisiert (falls relevant)

### Dependencies & Performance
- [ ] Keine unnötigen Dependencies hinzugefügt
- [ ] Bundle-Size nicht signifikant erhöht
- [ ] Performance nicht negativ beeinflusst
- [ ] Lighthouse Score ≥ 95 (falls Frontend-Änderungen)

---

## 🔗 Verknüpfungen

Fixes #<!-- Issue-Nummer -->  
Related to #<!-- Weitere Issues -->

---

## 🧪 Test-Anleitung

<!-- Wie können Reviewer:innen die Änderungen testen? -->

1. Checkout des Branches: `git checkout <branch-name>`
2. Dependencies installieren: `npm install`
3. Dev-Server starten: `npm run dev`
4. Folgende Schritte ausführen:
   - [ ] Schritt 1
   - [ ] Schritt 2
   - [ ] Schritt 3

**Erwartetes Verhalten:**
<!-- Was sollte passieren? -->

---

## 💭 Notizen für Reviewer:innen

<!-- Gibt es etwas, worauf besonders geachtet werden sollte? -->
<!-- Bekannte Limitierungen oder Trade-offs? -->
<!-- Offene Fragen oder Diskussionspunkte? -->

---

## 📊 Impact Assessment

### Breaking Changes
- [ ] Ja → **Beschreibung:**
- [x] Nein

### Migration erforderlich
- [ ] Ja → **Migration Guide:**
- [x] Nein

### Betroffene Bereiche
<!-- Wähle alle zutreffenden aus -->
- [ ] Authentication / Authorization
- [ ] UI/UX
- [ ] API/Backend
- [ ] Database
- [ ] Deployment/CI/CD
- [ ] Documentation
- [ ] Performance
- [ ] Security

---

## 🎯 Definition of Done

- [ ] Code Review von mindestens 1 Person
- [ ] Alle CI Checks grün (Lint, Build, Tests)
- [ ] Dokumentation vollständig
- [ ] Security Scan approved
- [ ] Accessibility Check passed
- [ ] Manual Testing durchgeführt
- [ ] Branch ist up-to-date mit main/master

---

> _„Im Dunkel des Alls glitzert jeder Pull Request als eigene Galaxie."_ ✨
