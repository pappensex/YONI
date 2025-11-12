/**
 * Task and Subtask Type Definitions for YONI Deploy Control Center
 * Implements Variante B - Subtask-basierter Fortschritt
 */

export type TaskStatus = "✅" | "🔄" | "❌" | "⚙️";

export interface Subtask {
  /** Unique identifier for the subtask */
  id: string;
  /** Name/Title of the subtask */
  name: string;
  /** Reference to parent Launch Task (by ID) */
  parent: string;
  /** Status of the subtask */
  status: TaskStatus;
}

export interface LaunchTask {
  /** Unique identifier for the task */
  id: string;
  /** Name/Title of the task */
  task: string;
  /** Current status */
  status: TaskStatus;
  /** Description/Comment */
  comment: string;
  /** Associated subtasks */
  subtasks?: Subtask[];
}

export interface TaskProgress {
  /** Total number of subtasks */
  total: number;
  /** Number of completed subtasks */
  completed: number;
  /** Progress percentage (0-100) */
  progressPercent: number;
}

/**
 * Calculate progress percentage for a launch task based on its subtasks
 * @param task - The launch task with subtasks
 * @returns TaskProgress object with completion statistics
 */
export function calculateTaskProgress(task: LaunchTask): TaskProgress {
  if (!task.subtasks || task.subtasks.length === 0) {
    return {
      total: 0,
      completed: 0,
      progressPercent: 0,
    };
  }

  const total = task.subtasks.length;
  const completed = task.subtasks.filter((s) => s.status === "✅").length;
  const progressPercent = Math.round((completed / total) * 100);

  return {
    total,
    completed,
    progressPercent,
  };
}

/**
 * Calculate overall progress across all tasks
 * @param tasks - Array of launch tasks
 * @returns TaskProgress object with overall completion statistics
 */
export function calculateOverallProgress(tasks: LaunchTask[]): TaskProgress {
  const totalSubtasks = tasks.reduce(
    (sum, task) => sum + (task.subtasks?.length || 0),
    0
  );

  const completedSubtasks = tasks.reduce(
    (sum, task) =>
      sum + (task.subtasks?.filter((s) => s.status === "✅").length || 0),
    0
  );

  const progressPercent =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return {
    total: totalSubtasks,
    completed: completedSubtasks,
    progressPercent,
  };
}
