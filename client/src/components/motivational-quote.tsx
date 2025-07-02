import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quote, RefreshCw } from "lucide-react";
import { useQuotes } from "@/hooks/use-quotes";

export function MotivationalQuote() {
  const { quote, isLoading, fetchNewQuote, isFetching } = useQuotes();

  return (
    <Card className="shadow-lg border-gray-100 bg-gradient-to-br from-lavender/20 via-coral/20 to-lemon/20">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
          <Quote className="w-5 h-5 text-lavender mr-2" />
          Daily Motivation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="text-center">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mx-auto"></div>
            </div>
          ) : quote ? (
            <>
              <p className="text-gray-700 italic mb-3">
                "{quote.text}"
              </p>
              <cite className="text-sm text-gray-500">- {quote.author}</cite>
            </>
          ) : (
            <p className="text-gray-700 italic mb-3">
              "Every great journey begins with a single step. You've got this! 🌟"
            </p>
          )}
        </blockquote>

        <Button
          onClick={() => fetchNewQuote()}
          disabled={isFetching}
          variant="outline"
          className="w-full mt-4 bg-white/50 hover:bg-white/80 transition-colors text-sm font-medium text-gray-700"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
          New Quote
        </Button>
      </CardContent>
    </Card>
  );
}
