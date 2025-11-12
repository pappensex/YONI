# 📋 Subtask-basierter Fortschritt (Variante B)

## Übersicht

Dieses Dokument beschreibt die Implementierung von **Variante B** - einem subtask-basierten Fortschrittssystem für das YONI Deploy Control Center.

## Features

### 1. Subtasks Database

Jeder **Subtask** hat folgende Properties:

- **Name (Title)**: Beschreibung der Teilaufgabe
- **Parent**: Relation zum übergeordneten Launch Task (über ID)
- **Status**: Select-Feld mit Optionen:
  - ✅ Complete
  - 🔄 In Progress
  - ⚙️ In Progress (alternative)
  - ❌ Blocked/Failed

### 2. Launch Tasks mit Rollup

Jeder **Launch Task** verfügt über:

- **Subtasks Done (Rollup)**: Automatische Berechnung des Prozentsatzes der abgeschlossenen Subtasks
- **Progress %**: Formel-Property, die den Fortschritt in Prozent anzeigt
  - Bei Tasks mit Subtasks: `(Completed Subtasks / Total Subtasks) * 100`
  - Bei Tasks ohne Subtasks: `100%` wenn Status = ✅, sonst `0%`

### 3. Overall Progress Berechnung

Der Gesamtfortschritt wird wie folgt berechnet:

```typescript
Overall Progress = (Total Completed Subtasks / Total Subtasks) * 100
```

Falls es Tasks ohne Subtasks gibt, werden diese nicht in die Berechnung einbezogen.

## Datenstruktur

### TypeScript Interfaces

```typescript
export interface Subtask {
  id: string;           // Unique identifier
  name: string;         // Name/Title
  parent: string;       // Parent task ID
  status: TaskStatus;   // ✅ | 🔄 | ⚙️ | ❌
}

export interface LaunchTask {
  id: string;
  task: string;
  status: TaskStatus;
  comment: string;
  subtasks?: Subtask[];
}
```

## Markdown Format

### Beispiel Deploy-Status.md

```markdown
# 📦 YONI Deploy Status with Subtasks

## Deployment Tasks

| Task | Status | Description | Progress % |
|------|--------|-------------|------------|
| 1. Repository Setup | ✅ Complete | Initial repository structure | 100% |
| 6. Email Notifications | 🔄 In Progress | Email system configuration | 66% |

## Subtasks

### Task 6: Email Notifications
| Subtask | Status |
|---------|--------|
| Configure SMTP server | ✅ |
| Set up email templates | ✅ |
| Implement notification triggers | 🔄 |
```

## Verwendung

### 1. Erstellen von Subtasks

Fügen Sie Subtasks unter dem `## Subtasks` Abschnitt hinzu:

```markdown
### Task [ID]: [Task Name]
| Subtask | Status |
|---------|--------|
| Subtask 1 | ✅ |
| Subtask 2 | 🔄 |
```

### 2. Automatische Progress Berechnung

Die Progress-Spalte wird automatisch vom Parser berechnet:

- **Mit Subtasks**: `(Completed / Total) * 100`
- **Ohne Subtasks**: `100%` wenn ✅, sonst `0%`

### 3. UI-Komponente

Das `YoniDeployControlCenter` zeigt:

- Gesamtfortschritt (basierend auf allen Subtasks)
- Task-Cards mit expandierbaren Subtasks
- Progress-Bars für jeden Task mit Subtasks
- Status-Indikatoren für jedes Subtask

### 4. Erweitern/Ausblenden von Subtasks

Klicken Sie auf den Chevron-Button (▶/▼) neben einem Task, um die Subtasks zu expandieren oder auszublenden.

## API

### Parser Functions

```typescript
// Parse markdown file with subtasks
parseStatusMarkdown(text: string): LaunchTask[]

// Calculate progress for a single task
calculateTaskProgress(task: LaunchTask): TaskProgress

// Calculate overall progress
calculateOverallProgress(tasks: LaunchTask[]): TaskProgress

// Generate markdown from tasks
generateStatusMarkdown(tasks: LaunchTask[]): string
```

## Migrations-Guide

### Von Legacy zu Subtask-Format

1. Behalten Sie das ursprüngliche Task-Format bei
2. Fügen Sie die `Progress %` Spalte hinzu
3. Erstellen Sie einen `## Subtasks` Abschnitt
4. Fügen Sie Subtasks für Tasks hinzu, die feinere Tracking-Granularität benötigen

### Backward Compatibility

Der Parser unterstützt beide Formate:

- **Neues Format**: Mit Subtasks und Progress %
- **Legacy Format**: Ohne Subtasks (verwendet `parseStatusMarkdownLegacy`)

## Beispiel-Implementation

Siehe:
- `/core/types/tasks.ts` - Type Definitionen
- `/core/utils/markdownParser.ts` - Parser Utilities
- `/core/modules/deploy-center/YoniDeployControlCenter.tsx` - UI Component
- `/Transzendenz/Reports/Deploy-Status-Subtasks.md` - Beispiel Daten

## Testing

Testen Sie die Implementation mit:

```bash
# Component testen
npm run dev

# Navigieren zu: /deploy-center
```

Überprüfen Sie:
- ✅ Subtasks werden korrekt geparst
- ✅ Progress % wird richtig berechnet
- ✅ Expand/Collapse funktioniert
- ✅ Status-Icons werden korrekt angezeigt
- ✅ Gesamtfortschritt ist akkurat

## Vorteile

1. **Granularität**: Feinere Fortschrittskontrolle durch Subtasks
2. **Transparenz**: Klare Sicht auf den Status jeder Teilaufgabe
3. **Motivation**: Sichtbarer Fortschritt motiviert das Team
4. **Planung**: Bessere Projektplanung durch detaillierte Task-Zerlegung
5. **Flexibilität**: Tasks können mit oder ohne Subtasks verwendet werden

## Best Practices

1. Verwenden Sie Subtasks für komplexe Tasks (> 1 Tag Aufwand)
2. Halten Sie Subtasks spezifisch und messbar
3. Aktualisieren Sie Status regelmäßig
4. Verwenden Sie konsistente Namenskonventionen
5. Dokumentieren Sie Blocker in den Comments

---

**Version:** 1.0  
**Autor:** YONI Development Team  
**Datum:** 2025-11-12
