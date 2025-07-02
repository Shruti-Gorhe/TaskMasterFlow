import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCategoryEmoji } from "@/lib/utils";
import type { Task } from "@shared/schema";

interface TaskFiltersProps {
  tasks: Task[];
  onFilterChange: (filteredTasks: Task[]) => void;
}

export function TaskFilters({ tasks, onFilterChange }: TaskFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "completed">("all");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const applyFilters = (filter: "all" | "pending" | "completed", category: string | null = activeCategory) => {
    let filteredTasks = [...tasks];

    // Filter by status
    if (filter === "pending") {
      filteredTasks = filteredTasks.filter(task => !task.completed);
    } else if (filter === "completed") {
      filteredTasks = filteredTasks.filter(task => task.completed);
    }

    // Filter by category
    if (category) {
      filteredTasks = filteredTasks.filter(task => task.category === category);
    }

    onFilterChange(filteredTasks);
  };

  const handleStatusFilter = (filter: "all" | "pending" | "completed") => {
    setActiveFilter(filter);
    applyFilters(filter);
  };

  const handleCategoryFilter = (category: string) => {
    const newCategory = activeCategory === category ? null : category;
    setActiveCategory(newCategory);
    applyFilters(activeFilter, newCategory);
  };

  const categories = ["Personal", "Work", "Fitness", "Home"];
  const filteredCount = (() => {
    let count = tasks.length;
    if (activeFilter === "pending") count = tasks.filter(t => !t.completed).length;
    if (activeFilter === "completed") count = tasks.filter(t => t.completed).length;
    if (activeCategory) count = tasks.filter(t => t.category === activeCategory).length;
    return count;
  })();

  return (
    <Card className="card-bloom shadow-xl border-pink-200/40 dark:border-purple-500/30">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Filter Tasks 🔍</h3>
            <Badge variant="secondary" className="bg-gradient-to-r from-mint/20 to-sky/20 text-mint font-medium animate-shimmer">
              {filteredCount} tasks
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleStatusFilter("all")}
              variant={activeFilter === "all" ? "default" : "outline"}
              className={`text-sm font-medium transition-colors ${
                activeFilter === "all"
                  ? "bg-mint text-white hover:bg-mint/90"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Tasks
            </Button>
            <Button
              onClick={() => handleStatusFilter("pending")}
              variant={activeFilter === "pending" ? "default" : "outline"}
              className={`text-sm font-medium transition-colors ${
                activeFilter === "pending"
                  ? "bg-mint text-white hover:bg-mint/90"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending
            </Button>
            <Button
              onClick={() => handleStatusFilter("completed")}
              variant={activeFilter === "completed" ? "default" : "outline"}
              className={`text-sm font-medium transition-colors ${
                activeFilter === "completed"
                  ? "bg-mint text-white hover:bg-mint/90"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Completed
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Categories:</span>
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              variant="outline"
              size="sm"
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                activeCategory === category
                  ? "bg-blue-200 text-blue-800 border-blue-300"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              {getCategoryEmoji(category)} {category}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
