import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import type { Task } from "@shared/schema";

interface WeeklyOverviewProps {
  tasks: Task[];
}

export function WeeklyOverview({ tasks }: WeeklyOverviewProps) {
  const today = new Date();
  const weekDays = [];
  
  // Generate the current week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDays.push(date);
  }

  const getTasksForDay = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="shadow-lg border-gray-100">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
          <Calendar className="w-5 h-5 text-sky mr-2" />
          This Week
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {weekDays.map((date, index) => {
          const dayTasks = getTasksForDay(date);
          const completedTasks = dayTasks.filter(task => task.completed).length;
          const totalTasks = dayTasks.length;
          const isCurrentDay = isToday(date);
          
          return (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                isCurrentDay
                  ? "bg-coral/10 border-l-4 border-coral"
                  : index < today.getDay()
                  ? "bg-mint/10"
                  : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isCurrentDay
                      ? "bg-coral animate-pulse"
                      : index < today.getDay()
                      ? "bg-mint"
                      : "bg-gray-300"
                  }`}
                />
                <span
                  className={`font-medium ${
                    isCurrentDay
                      ? "text-gray-800"
                      : index < today.getDay()
                      ? "text-gray-800"
                      : "text-gray-500"
                  }`}
                >
                  {isCurrentDay ? "Today" : dayNames[index]}
                </span>
              </div>
              <span
                className={`text-sm font-medium ${
                  isCurrentDay
                    ? "text-coral"
                    : index < today.getDay()
                    ? "text-mint"
                    : "text-gray-400"
                }`}
              >
                {totalTasks > 0 ? `${completedTasks}/${totalTasks} tasks` : "No tasks"}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
