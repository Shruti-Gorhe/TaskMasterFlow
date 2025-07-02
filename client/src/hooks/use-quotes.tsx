import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

interface Quote {
  text: string;
  author: string;
}

export function useQuotes() {
  const query = useQuery<Quote>({
    queryKey: ["/api/quote"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const fetchNewQuoteMutation = useMutation({
    mutationFn: async (): Promise<Quote> => {
      const response = await fetch("/api/quote");
      return response.json();
    },
    onSuccess: (newQuote) => {
      queryClient.setQueryData(["/api/quote"], newQuote);
    },
  });

  return {
    quote: query.data,
    isLoading: query.isLoading,
    error: query.error,
    fetchNewQuote: fetchNewQuoteMutation.mutate,
    isFetching: fetchNewQuoteMutation.isPending,
  };
}
