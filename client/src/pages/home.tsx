import { useState, useEffect } from "react";
import { Moon, Sun, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TaskInput } from "@/components/task-input";
import { TaskFilters } from "@/components/task-filters";
import { TaskList } from "@/components/task-list";
import { ProgressTracker } from "@/components/progress-tracker";
import { MotivationalQuote } from "@/components/motivational-quote";
import { WeeklyOverview } from "@/components/weekly-overview";
import { QuickActions } from "@/components/quick-actions";
import { CelebrationModal } from "@/components/celebration-modal";
import { ThoughtOfTheDay } from "@/components/thought-of-the-day";
import { useTheme } from "@/components/theme-provider";
import { useTasks } from "@/hooks/use-tasks";
import type { Task } from "@shared/schema";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { tasks, isLoading } = useTasks();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  // Update filtered tasks when tasks change
  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen floral-bg floral-pattern bg-gradient-to-br from-rose-50/30 via-sky-50/30 to-mint-50/30 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      {/* Header */}
      <header className="card-bloom backdrop-blur-md border-b border-pink-200/30 dark:border-gray-700/50 sticky top-0 z-50 animate-shimmer">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-mint via-sky to-lavender rounded-2xl flex items-center justify-center animate-float shadow-lg">
                <ListTodo className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  TaskFlow ✨
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                  Stay organized, stay motivated 🌸
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                )}
              </Button>

              <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-sm">
                <div className="w-3 h-3 bg-mint rounded-full animate-pulse"></div>
                <Badge variant="secondary" className="text-sm font-medium">
                  {completedTasks}
                </Badge>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  tasks completed today
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Task Input & Filters */}
          <div className="lg:col-span-2 space-y-6">
            <TaskInput />
            <TaskFilters tasks={tasks} onFilterChange={setFilteredTasks} />
            <TaskList filteredTasks={filteredTasks} />
          </div>

          {/* Right Column: Stats & Motivation */}
          <div className="space-y-6">
            <ProgressTracker tasks={tasks} />
            <ThoughtOfTheDay />
            <MotivationalQuote />
            <WeeklyOverview tasks={tasks} />
            <QuickActions />
          </div>
        </div>
      </main>

      {/* Celebration Modal */}
      <CelebrationModal tasks={tasks} />
    </div>
  );
}
