import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  // Use state to guarantee the client is only created once per render lifecycle
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1, // Minimize aggressive retries in UI
            refetchOnWindowFocus: false, // Prevents excessive network calls during dev/demo
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
