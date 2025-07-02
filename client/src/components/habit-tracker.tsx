import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Plus, Droplets, Activity, Book, Brain, Target, CheckCircle2, Circle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Habit, HabitEntry } from "@shared/schema";

interface HabitWithEntries extends Habit {
  todayEntry?: HabitEntry;
  weekProgress?: number;
}

export function HabitTracker() {
  const [habits, setHabits] = useState<HabitWithEntries[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: "",
    habitType: "custom" as const,
    targetValue: 1,
    unit: "times",
  });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const habitsData = await apiRequest("/api/habits");
      const habitsWithEntries = await Promise.all(
        habitsData.map(async (habit: Habit) => {
          const entries = await apiRequest(`/api/habits/${habit.id}/entries?date=${today}`);
          const todayEntry = entries.find((entry: HabitEntry) => entry.date === today);
          
          // Calculate week progress
          const weekEntries = await getWeekEntries(habit.id);
          const weekProgress = (weekEntries.filter((entry: HabitEntry) => entry.completed).length / 7) * 100;
          
          return {
            ...habit,
            todayEntry,
            weekProgress,
          };
        })
      );
      setHabits(habitsWithEntries);
    } catch (error) {
      console.error("Failed to fetch habits:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWeekEntries = async (habitId: number) => {
    const weekDates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      weekDates.push(date.toISOString().split('T')[0]);
    }
    
    try {
      const entries = await apiRequest(`/api/habits/${habitId}/entries`);
      return entries.filter((entry: HabitEntry) => weekDates.includes(entry.date));
    } catch (error) {
      return [];
    }
  };

  const getHabitIcon = (habitType: string) => {
    switch (habitType) {
      case "water":
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case "workout":
        return <Activity className="w-5 h-5 text-green-500" />;
      case "reading":
        return <Book className="w-5 h-5 text-purple-500" />;
      case "meditation":
        return <Brain className="w-5 h-5 text-indigo-500" />;
      default:
        return <Target className="w-5 h-5 text-gray-500" />;
    }
  };

  const updateHabitEntry = async (habitId: number, value: number) => {
    try {
      const existingEntry = habits.find(h => h.id === habitId)?.todayEntry;
      
      if (existingEntry) {
        await apiRequest(`/api/habits/entries/${existingEntry.id}`, {
          method: "PATCH",
          body: JSON.stringify({ value, completed: value > 0 }),
        });
      } else {
        await apiRequest("/api/habits/entries", {
          method: "POST", 
          body: JSON.stringify({
            habitId,
            date: today,
            value,
            completed: value > 0,
          }),
        });
      }
      
      fetchHabits(); // Refresh data
    } catch (error) {
      console.error("Failed to update habit entry:", error);
    }
  };

  const createHabit = async () => {
    try {
      await apiRequest("/api/habits", {
        method: "POST",
        body: JSON.stringify(newHabit),
      });
      
      setNewHabit({
        title: "",
        habitType: "custom",
        targetValue: 1,
        unit: "times",
      });
      setShowAddForm(false);
      fetchHabits();
    } catch (error) {
      console.error("Failed to create habit:", error);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-yellow-500";
    if (progress >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <Card className="card-bloom shadow-lg border-pastel-mint/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pastel-mint"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="card-bloom shadow-xl border-pastel-mint/40 bg-gradient-to-br from-pastel-mint/10 to-pastel-green/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center text-xl font-bold gradient-text">
            <Target className="w-6 h-6 mr-2 text-pastel-mint" />
            Daily Habits
          </CardTitle>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
            className="bg-gradient-to-r from-pastel-mint to-pastel-green text-gray-700 hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Habit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Habit Form */}
          {showAddForm && (
            <Card className="border-pastel-mint/30 bg-pastel-mint/5">
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Habit name (e.g., Drink water)"
                    value={newHabit.title}
                    onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                    className="border-pastel-mint/50"
                  />
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Target"
                      value={newHabit.targetValue}
                      onChange={(e) => setNewHabit({ ...newHabit, targetValue: parseInt(e.target.value) || 1 })}
                      className="border-pastel-mint/50 w-20"
                    />
                    <Input
                      placeholder="Unit (e.g., glasses, minutes)"
                      value={newHabit.unit}
                      onChange={(e) => setNewHabit({ ...newHabit, unit: e.target.value })}
                      className="border-pastel-mint/50"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={createHabit}
                    disabled={!newHabit.title.trim()}
                    className="bg-pastel-mint text-gray-700"
                  >
                    Create Habit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Habits List */}
          <div className="space-y-3">
            {habits.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No habits yet. Start building healthy routines!</p>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="mt-3 bg-pastel-mint text-gray-700"
                >
                  Create Your First Habit
                </Button>
              </div>
            ) : (
              habits.map((habit) => (
                <Card key={habit.id} className="border-pastel-mint/20 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getHabitIcon(habit.habitType)}
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                            {habit.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Target: {habit.targetValue} {habit.unit}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {/* Progress for the week */}
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">Week</div>
                          <div className={`w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden`}>
                            <div 
                              className={`h-full ${getProgressColor(habit.weekProgress || 0)} transition-all duration-300`}
                              style={{ width: `${habit.weekProgress || 0}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{Math.round(habit.weekProgress || 0)}%</div>
                        </div>
                        
                        {/* Today's progress */}
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            min="0"
                            max={habit.targetValue * 2}
                            value={habit.todayEntry?.value || 0}
                            onChange={(e) => updateHabitEntry(habit.id, parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-center border-pastel-mint/50"
                          />
                          <span className="text-sm text-gray-500">/ {habit.targetValue}</span>
                          <button
                            onClick={() => {
                              const newValue = habit.todayEntry?.completed ? 0 : habit.targetValue;
                              updateHabitEntry(habit.id, newValue);
                            }}
                            className="p-1"
                          >
                            {habit.todayEntry?.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-green-500" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Daily progress bar */}
                    <div className="mt-3">
                      <Progress 
                        value={Math.min(((habit.todayEntry?.value || 0) / habit.targetValue) * 100, 100)}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}