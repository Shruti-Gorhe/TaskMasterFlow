import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import type { InsertTask } from "@shared/schema";
import { getCategoryEmoji, getPriorityEmoji } from "@/lib/utils";

export function TaskInput() {
  const { createTask, isCreating } = useTasks();
  const [formData, setFormData] = useState<InsertTask>({
    title: "",
    description: "",
    category: "Personal",
    priority: "Medium",
    dueDate: "",
    completed: false,
    order: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    createTask({
      ...formData,
      order: Date.now(), // Simple ordering system
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "Personal",
      priority: "Medium",
      dueDate: "",
      completed: false,
      order: 0,
    });
  };

  return (
    <Card className="card-bloom shadow-xl border-pink-200/40 dark:border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold text-gray-800 dark:text-gray-100">
          <Plus className="w-6 h-6 text-mint mr-2 animate-float" />
          Add New Task 🌟
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="What needs to be done? ✨"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="flex-1 px-4 py-3 border-pink-200/50 dark:border-purple-500/30 rounded-xl focus:ring-2 focus:ring-mint/50 focus:border-mint transition-all glass-effect"
            />
            <Button
              type="submit"
              disabled={isCreating || !formData.title.trim()}
              className="px-6 py-3 bg-gradient-to-r from-mint via-sky to-lavender text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium animate-shimmer"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isCreating ? "Adding..." : "Add Task"}
            </Button>
          </div>

          <Textarea
            placeholder="Add a description (optional)"
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="border-gray-200 rounded-xl focus:ring-2 focus:ring-mint/50 focus:border-mint transition-all"
            rows={2}
          />

          <div className="flex flex-wrap gap-3">
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as any })}
            >
              <SelectTrigger className="px-3 py-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-lavender/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Personal">{getCategoryEmoji("Personal")} Personal</SelectItem>
                <SelectItem value="Work">{getCategoryEmoji("Work")} Work</SelectItem>
                <SelectItem value="Fitness">{getCategoryEmoji("Fitness")} Fitness</SelectItem>
                <SelectItem value="Home">{getCategoryEmoji("Home")} Home</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
            >
              <SelectTrigger className="px-3 py-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-coral/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">{getPriorityEmoji("High")} High Priority</SelectItem>
                <SelectItem value="Medium">{getPriorityEmoji("Medium")} Medium Priority</SelectItem>
                <SelectItem value="Low">{getPriorityEmoji("Low")} Low Priority</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Input
                type="date"
                value={formData.dueDate || ""}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="px-3 py-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-lemon/50 focus:border-lemon transition-all pl-10"
              />
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
