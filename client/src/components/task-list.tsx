import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckSquare, Plus } from "lucide-react";
import { TaskItem } from "./task-item";
import { useTasks } from "@/hooks/use-tasks";
import type { Task } from "@shared/schema";

interface TaskListProps {
  filteredTasks: Task[];
}

export function TaskList({ filteredTasks }: TaskListProps) {
  const { updateTask, deleteTask, isLoading } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleToggleComplete = (id: number, completed: boolean) => {
    updateTask({ id, updates: { completed } });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    // TODO: Implement edit modal/form
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(id);
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg border-gray-100 overflow-hidden">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
            <CheckSquare className="w-5 h-5 text-sky mr-2" />
            Today's Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-bloom shadow-xl border-pink-200/40 dark:border-purple-500/30 overflow-hidden">
      <CardHeader className="border-b border-pink-200/30 dark:border-purple-500/30">
        <CardTitle className="flex items-center text-xl font-semibold text-gray-800 dark:text-gray-100">
          <CheckSquare className="w-6 h-6 text-sky mr-2 animate-float" />
          Today's Tasks 📋
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-4">
              {filteredTasks.length === 0 ? "Add your first task to get started!" : "All tasks completed! Great job! 🎉"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
        
        {filteredTasks.length > 0 && (
          <div className="p-4 bg-gray-50/50 text-center border-t border-gray-100">
            <Button variant="ghost" className="text-sky hover:text-sky/80 font-medium text-sm transition-colors">
              <Plus className="w-4 h-4 mr-1" />
              Add another task
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
