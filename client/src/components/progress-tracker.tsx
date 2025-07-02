import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import type { Task } from "@shared/schema";

interface ProgressTrackerProps {
  tasks: Task[];
}

export function ProgressTracker({ tasks }: ProgressTrackerProps) {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const pendingTasks = totalTasks - completedTasks;

  // Daily goal (can be made configurable)
  const dailyGoal = 15;
  const dailyProgress = Math.min(completedTasks, dailyGoal);
  const dailyPercentage = (dailyProgress / dailyGoal) * 100;

  return (
    <Card className="shadow-lg border-gray-100">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
          <TrendingUp className="w-5 h-5 text-mint mr-2" />
          Today's Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-3">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${progressPercentage * 2.51} 251`}
                className="text-mint transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-800">{progressPercentage}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">Tasks Completed</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-mint/10 rounded-xl p-3">
            <div className="text-2xl font-bold text-mint">{completedTasks}</div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="bg-coral/10 rounded-xl p-3">
            <div className="text-2xl font-bold text-coral">{pendingTasks}</div>
            <div className="text-xs text-gray-600">Remaining</div>
          </div>
        </div>

        <div className="bg-lemon/10 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Daily Goal</span>
            <span className="text-sm font-bold text-lemon">{dailyProgress}/{dailyGoal}</span>
          </div>
          <Progress 
            value={dailyPercentage} 
            className="h-2"
          />
          {dailyProgress >= dailyGoal && (
            <div className="text-xs text-mint font-medium mt-1 text-center">
              🎉 Daily goal achieved!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
