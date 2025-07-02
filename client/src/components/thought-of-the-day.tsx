import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThoughtOfTheDay {
  text: string;
  author: string;
  category: string;
}

const thoughtsOfTheDay: ThoughtOfTheDay[] = [
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "Action"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Persistence"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    category: "Motivation"
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "Growth"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "Productivity"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "Confidence"
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi",
    category: "Action"
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    category: "Hope"
  },
  {
    text: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
    category: "Dreams"
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "Action"
  }
];

export function ThoughtOfTheDay() {
  const [currentThought, setCurrentThought] = useState<ThoughtOfTheDay>(thoughtsOfTheDay[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getRandomThought = () => {
    const randomIndex = Math.floor(Math.random() * thoughtsOfTheDay.length);
    return thoughtsOfTheDay[randomIndex];
  };

  const refreshThought = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCurrentThought(getRandomThought());
      setIsRefreshing(false);
    }, 300);
  };

  useEffect(() => {
    // Set a random thought on component mount
    setCurrentThought(getRandomThought());
  }, []);

  return (
    <Card className="card-bloom shadow-lg border-yellow-200/40 dark:border-amber-500/30 bg-gradient-to-br from-lemon/10 via-white to-mint/5 dark:from-amber-900/20 dark:via-gray-800 dark:to-emerald-900/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-800 dark:text-gray-100">
          <div className="flex items-center">
            <Lightbulb className="w-5 h-5 text-lemon mr-2 animate-pulse" />
            Thought of the Day
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshThought}
            disabled={isRefreshing}
            className="h-8 w-8 p-0 hover:bg-lemon/20 dark:hover:bg-amber-500/20"
          >
            <RefreshCw className={`w-4 h-4 text-lemon ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <blockquote className="text-gray-700 dark:text-gray-300 italic text-sm leading-relaxed">
            "{currentThought.text}"
          </blockquote>
          <div className="flex justify-between items-center">
            <cite className="text-gray-600 dark:text-gray-400 text-xs font-medium">
              — {currentThought.author}
            </cite>
            <span className="text-xs px-2 py-1 bg-lemon/20 dark:bg-amber-500/20 text-lemon-dark dark:text-amber-300 rounded-full">
              {currentThought.category}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}