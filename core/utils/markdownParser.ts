/**
 * Parser utilities for Deploy Status markdown files with subtask support
 * Implements Variante B - Subtask-basierter Fortschritt
 */

import { LaunchTask, Subtask, TaskStatus } from "../types/tasks";

/**
 * Parse a Deploy-Status markdown file and extract tasks and subtasks
 * @param text - Raw markdown text content
 * @returns Array of LaunchTask objects with subtasks
 */
export function parseStatusMarkdown(text: string): LaunchTask[] {
  const lines = text.split("\n");
  const tasks: LaunchTask[] = [];
  let currentTask: LaunchTask | null = null;
  let parsingSubtasks = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Parse main tasks table
    if (line.startsWith("|") && !parsingSubtasks) {
      // Skip header and separator rows
      if (line.includes("Task") || line.includes("---")) continue;

      const cols = line.split("|").map((c) => c.trim());
      if (cols.length >= 5) {
        const task: LaunchTask = {
          id: cols[1],
          task: cols[2],
          status: cols[3] as TaskStatus,
          comment: cols[4],
          subtasks: [],
        };
        tasks.push(task);
      }
    }

    // Detect subtask section header (e.g., "### Task 6: Email Notifications")
    if (line.startsWith("### Task ")) {
      parsingSubtasks = true;
      const taskIdMatch = line.match(/### Task (\d+):/);
      if (taskIdMatch) {
        const taskId = taskIdMatch[1];
        currentTask = tasks.find((t) => t.id === taskId) || null;
      }
    }

    // Parse subtasks table
    if (parsingSubtasks && line.startsWith("|") && currentTask) {
      // Skip header and separator rows
      if (line.includes("Subtask") || line.includes("---")) continue;

      const cols = line.split("|").map((c) => c.trim());
      if (cols.length >= 3 && cols[1] && cols[2]) {
        const subtask: Subtask = {
          id: `${currentTask.id}-${currentTask.subtasks!.length + 1}`,
          name: cols[1],
          parent: currentTask.id,
          status: cols[2] as TaskStatus,
        };
        currentTask.subtasks!.push(subtask);
      }
    }

    // End of subtask section (empty line or new section)
    if (parsingSubtasks && (line === "" || line.startsWith("##"))) {
      parsingSubtasks = false;
      currentTask = null;
    }
  }

  return tasks;
}

/**
 * Legacy parser for backward compatibility with old format
 * @param text - Raw markdown text content
 * @returns Array of LaunchTask objects without subtasks
 */
export function parseStatusMarkdownLegacy(text: string): LaunchTask[] {
  const lines = text.split("\n").filter((l) => l.match(/^\|/));
  return lines.slice(2).map((line) => {
    const cols = line.split("|").map((c) => c.trim());
    return {
      id: cols[1],
      task: cols[2],
      status: cols[3] as TaskStatus,
      comment: cols[4],
      subtasks: [],
    };
  });
}

/**
 * Generate markdown content from tasks and subtasks
 * @param tasks - Array of LaunchTask objects
 * @returns Formatted markdown string
 */
export function generateStatusMarkdown(tasks: LaunchTask[]): string {
  let markdown = "# 📦 YONI Deploy Status with Subtasks\n\n";
  markdown += `**Last Updated:** ${new Date().toISOString().split("T")[0]}\n\n`;
  markdown += "## Deployment Tasks\n\n";
  markdown += "| Task | Status | Description | Progress % |\n";
  markdown += "|------|--------|-------------|------------|\n";

  const tasksWithProgress = tasks.map((task) => {
    const progress = calculateProgress(task);
    return `| ${task.id} | ${task.status} | ${task.comment} | ${progress}% |\n`;
  });

  markdown += tasksWithProgress.join("");
  markdown += "\n## Subtasks\n\n";

  tasks.forEach((task) => {
    if (task.subtasks && task.subtasks.length > 0) {
      markdown += `### Task ${task.id}: ${task.task}\n`;
      markdown += "| Subtask | Status |\n";
      markdown += "|---------|--------|\n";
      task.subtasks.forEach((subtask) => {
        markdown += `| ${subtask.name} | ${subtask.status} |\n`;
      });
      markdown += "\n";
    }
  });

  const summary = generateSummary(tasks);
  markdown += summary;

  return markdown;
}

/**
 * Calculate progress percentage for a task
 * @param task - LaunchTask object
 * @returns Progress percentage (0-100)
 */
function calculateProgress(task: LaunchTask): number {
  if (!task.subtasks || task.subtasks.length === 0) {
    return task.status === "✅" ? 100 : 0;
  }

  const completed = task.subtasks.filter((s) => s.status === "✅").length;
  return Math.round((completed / task.subtasks.length) * 100);
}

/**
 * Generate summary section
 * @param tasks - Array of LaunchTask objects
 * @returns Summary markdown string
 */
function generateSummary(tasks: LaunchTask[]): string {
  const completed = tasks.filter((t) => t.status === "✅").length;
  const inProgress = tasks.filter((t) => t.status === "🔄").length;
  const blocked = tasks.filter((t) => t.status === "❌").length;

  const totalSubtasks = tasks.reduce(
    (sum, t) => sum + (t.subtasks?.length || 0),
    0
  );
  const completedSubtasks = tasks.reduce(
    (sum, t) => sum + (t.subtasks?.filter((s) => s.status === "✅").length || 0),
    0
  );

  const overallProgress =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return `## Summary

- **Total Tasks:** ${tasks.length}
- **Completed:** ${completed}
- **In Progress:** ${inProgress}
- **Blocked:** ${blocked}
- **Total Subtasks:** ${totalSubtasks}
- **Completed Subtasks:** ${completedSubtasks}
- **Overall Progress:** ${overallProgress}%

## Notes

This status file is used by the deploy_snapshot.yml workflow to track deployment progress.
A snapshot of this file is created daily with the current date.

The Progress % column shows the percentage of completed subtasks for each task.
Tasks without subtasks show 100% when completed or 0% when not started.
`;
}
