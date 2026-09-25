"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";

/**
 * Provides a TanStack Query client to the React tree (30s default stale time).
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // tanstack query only updates the stale when a trigger is fired
            staleTime: 30 * 1000, // it tells your data would be fresh for 30 seconds and no network request would be made
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
