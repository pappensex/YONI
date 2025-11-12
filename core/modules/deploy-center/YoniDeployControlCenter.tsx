import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, ChevronDown, ChevronRight } from "lucide-react";
import { parseStatusMarkdown } from "../../utils/markdownParser";
import { calculateTaskProgress, calculateOverallProgress } from "../../types/tasks";
import type { LaunchTask } from "../../types/tasks";

export default function YoniDeployControlCenter() {
  const [statusData, setStatusData] = useState<LaunchTask[]>([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      // Try to fetch the subtasks-enabled version first, fallback to legacy
      const urls = [
        "https://raw.githubusercontent.com/pappensex/YONI-app/main/Transzendenz/Reports/Deploy-Status-Subtasks.md",
        "https://raw.githubusercontent.com/pihoch2/Transzendenz/main/Reports/Deploy-Status.md"
      ];
      
      let text = "";
      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            text = await res.text();
            break;
          }
        } catch (e) {
          continue;
        }
      }

      const parsed = parseStatusMarkdown(text);
      setStatusData(parsed);
      
      // Calculate overall progress based on subtasks if available
      const overallProgress = calculateOverallProgress(parsed);
      setProgress(overallProgress.progressPercent || 
        Math.round((parsed.filter((i) => i.status === "✅").length / parsed.length) * 100)
      );
    } catch (err) {
      console.error("Status-Load-Error", err);
    }
    setLoading(false);
  };

  const toggleTask = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-center">
        🚀 YONI Deploy-Control-Center
      </h1>
      <div className="flex flex-col items-center space-y-2">
        <Progress value={progress} className="w-full h-3" />
        <p className="text-sm text-muted-foreground">
          Gesamtfortschritt: {progress}% abgeschlossen
        </p>
        <Button onClick={fetchStatus} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" /> {loading ? "Aktualisiere…" : "Sync jetzt"}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statusData.map((item) => {
          const taskProgress = calculateTaskProgress(item);
          const isExpanded = expandedTasks.has(item.id);
          const hasSubtasks = item.subtasks && item.subtasks.length > 0;

          return (
            <Card
              key={item.id}
              className={`border-2 rounded-2xl shadow-md ${
                item.status === "✅"
                  ? "border-green-500"
                  : item.status === "🔄"
                  ? "border-yellow-400"
                  : item.status === "⚙️"
                  ? "border-yellow-400"
                  : "border-red-500"
              }`}
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    {hasSubtasks && (
                      <button
                        onClick={() => toggleTask(item.id)}
                        className="hover:bg-gray-100 rounded p-1"
                        aria-label={isExpanded ? "Collapse subtasks" : "Expand subtasks"}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    )}
                    <h2 className="font-semibold text-lg">{item.task}</h2>
                  </div>
                  {item.status === "✅" && <CheckCircle className="text-green-500" />}
                  {(item.status === "🔄" || item.status === "⚙️") && (
                    <AlertTriangle className="text-yellow-500" />
                  )}
                  {item.status === "❌" && <XCircle className="text-red-500" />}
                </div>
                
                <p className="text-sm text-muted-foreground">{item.comment}</p>
                
                {hasSubtasks && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span className="font-semibold">{taskProgress.progressPercent}%</span>
                    </div>
                    <Progress value={taskProgress.progressPercent} className="h-2 mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {taskProgress.completed} / {taskProgress.total} subtasks completed
                    </p>
                  </div>
                )}

                {hasSubtasks && isExpanded && (
                  <div className="mt-3 space-y-1 border-t pt-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                      Subtasks
                    </h3>
                    {item.subtasks!.map((subtask) => (
                      <div
                        key={subtask.id}
                        className="flex items-center justify-between text-sm py-1"
                      >
                        <span className={subtask.status === "✅" ? "line-through text-muted-foreground" : ""}>
                          {subtask.name}
                        </span>
                        <span className="text-lg">
                          {subtask.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
