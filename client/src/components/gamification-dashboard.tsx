import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Flame, Target, TrendingUp, Award, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { UserStats } from "@shared/schema";

interface GamificationDashboardProps {
  onCelebration?: () => void;
}

export function GamificationDashboard({ onCelebration }: GamificationDashboardProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiRequest("/api/stats");
      setStats(response);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressToNextLevel = () => {
    if (!stats) return 0;
    const pointsInCurrentLevel = (stats.totalPoints || 0) % 100;
    return pointsInCurrentLevel;
  };

  const getBadgeIcon = (badgeType: string) => {
    switch (badgeType) {
      case "streak":
        return <Flame className="w-4 h-4" />;
      case "completionist":
        return <Target className="w-4 h-4" />;
      case "rising_star":
        return <Star className="w-4 h-4" />;
      case "productivity_guru":
        return <TrendingUp className="w-4 h-4" />;
      case "habit_master":
        return <Award className="w-4 h-4" />;
      default:
        return <Trophy className="w-4 h-4" />;
    }
  };

  const getBadgeColor = (badgeType: string) => {
    switch (badgeType) {
      case "streak":
        return "bg-gradient-to-r from-red-400 to-orange-400";
      case "completionist":
        return "bg-gradient-to-r from-green-400 to-emerald-400";
      case "rising_star":
        return "bg-gradient-to-r from-yellow-400 to-amber-400";
      case "productivity_guru":
        return "bg-gradient-to-r from-blue-400 to-indigo-400";
      case "habit_master":
        return "bg-gradient-to-r from-purple-400 to-pink-400";
      default:
        return "bg-gradient-to-r from-pastel-purple to-pastel-blue";
    }
  };

  if (loading) {
    return (
      <Card className="card-bloom shadow-lg border-pastel-pink/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pastel-purple"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Card */}
      <Card className="card-bloom shadow-xl border-pastel-pink/40 bg-gradient-to-br from-pastel-pink/10 to-pastel-purple/10">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-bold gradient-text">
            <Trophy className="w-6 h-6 mr-2 text-amber-500" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Level and XP */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Level {stats?.level || 1}
              </span>
            </div>
            <div className="space-y-1">
              <Progress 
                value={getProgressToNextLevel()} 
                className="h-3 bg-gray-200 dark:bg-gray-700"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getProgressToNextLevel()}/100 XP to next level
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-pastel-blue/20">
              <div className="text-2xl font-bold text-pastel-blue-dark">{stats?.totalPoints || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total XP</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-pastel-green/20">
              <div className="text-2xl font-bold text-pastel-green-dark">{stats?.tasksCompleted || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tasks Done</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-pastel-orange/20 relative">
              <div className="text-2xl font-bold text-pastel-orange-dark flex items-center justify-center">
                <Flame className="w-6 h-6 mr-1" />
                {stats?.currentStreak || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-pastel-purple/20">
              <div className="text-2xl font-bold text-pastel-purple-dark">{stats?.longestStreak || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Best Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      {stats?.badges && Array.isArray(stats.badges) && stats.badges.length > 0 && (
        <Card className="card-bloom shadow-lg border-pastel-purple/30">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-100">
              <Award className="w-5 h-5 mr-2 text-amber-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {stats.badges.map((badge: any, index: number) => (
                <div
                  key={index}
                  className={`${getBadgeColor(badge.type)} p-3 rounded-lg text-white text-center shadow-lg transform hover:scale-105 transition-all duration-200`}
                >
                  <div className="flex items-center justify-center mb-1">
                    {getBadgeIcon(badge.type)}
                  </div>
                  <div className="text-xs font-medium">{badge.name}</div>
                  {badge.description && (
                    <div className="text-xs opacity-80 mt-1">{badge.description}</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Motivational Messages */}
      <Card className="card-bloom shadow-lg border-pastel-green/30 bg-gradient-to-r from-pastel-green/10 to-pastel-mint/10">
        <CardContent className="p-4 text-center">
          <div className="space-y-2">
            {stats?.currentStreak && stats.currentStreak >= 3 && (
              <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                <Flame className="w-3 h-3 mr-1" />
                On Fire! {stats.currentStreak} day streak!
              </Badge>
            )}
            {stats?.level && stats.level >= 5 && (
              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                <Star className="w-3 h-3 mr-1" />
                Productivity Master!
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}