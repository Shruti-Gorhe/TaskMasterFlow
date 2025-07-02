import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Edit, Trash2, Flag } from "lucide-react";
import { formatDate, getPriorityBadgeColor, getCategoryColor, getCategoryEmoji, getPriorityEmoji } from "@/lib/utils";
import type { Task } from "@shared/schema";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div
      className={`p-6 hover:bg-gray-50/50 transition-colors group border-b border-gray-100 last:border-b-0 ${
        task.completed ? "bg-gray-50/30" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-4">
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) => onToggleComplete(task.id, checked as boolean)}
          className="w-6 h-6 data-[state=checked]:bg-mint data-[state=checked]:border-mint"
        />

        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4
              className={`font-medium transition-all ${
                task.completed
                  ? "text-gray-500 line-through"
                  : "text-gray-800"
              }`}
            >
              {task.title}
            </h4>
            <Badge className={`text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
              {getPriorityEmoji(task.priority)} {task.priority}
            </Badge>
            <Badge className={`text-xs ${getCategoryColor(task.category)}`}>
              {getCategoryEmoji(task.category)} {task.category}
            </Badge>
          </div>

          {task.description && (
            <p
              className={`text-sm transition-all ${
                task.completed
                  ? "text-gray-400 line-through"
                  : "text-gray-600"
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            {task.dueDate && (
              <span className={`flex items-center ${isOverdue ? "text-red-500 font-medium" : ""}`}>
                <Clock className="w-3 h-3 mr-1" />
                Due: {formatDate(task.dueDate)}
              </span>
            )}
            {task.priority === "High" && (
              <span className="flex items-center text-red-500">
                <Flag className="w-3 h-3 mr-1" />
                Important
              </span>
            )}
            {task.completed && (
              <span className="flex items-center text-mint">
                ✓ Completed
              </span>
            )}
          </div>
        </div>

        <div
          className={`flex items-center space-x-2 transition-opacity ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-sky hover:bg-sky/10 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
