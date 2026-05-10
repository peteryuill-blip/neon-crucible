import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        if (error?.message === "FETCH_FAILURE") return false;
        return failureCount < 2;
      },
    },
  },
});
