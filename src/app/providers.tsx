"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { ApiError } from "@/lib/api/errors";

const MAX_QUERY_RETRIES = 3;

/**
 * Erros 4xx (incluindo 429) são respostas definitivas da API — tentar de novo
 * na hora não muda o resultado (e piora o 429). Só falhas de rede e 5xx são
 * re-tentadas. Ver design.md do change handle-api-error-format.
 */
function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
    return false;
  }
  return failureCount < MAX_QUERY_RETRIES;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: shouldRetryQuery } },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
