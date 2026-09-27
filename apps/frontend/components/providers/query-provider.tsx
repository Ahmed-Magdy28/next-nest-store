"use client";

import {
  QueryClient,
  QueryClientProvider,
  isServer,
  MutationCache,
  QueryCache,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";

import { cacheTimeInMinutes } from "@repo/shared/constants";
import { ApiClientError } from "../../lib/api/common/client";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000 * cacheTimeInMinutes,
        gcTime: 60 * 1000 * 10,
        retry: (failureCount, error) => {
          // Don't retry auth / not-found errors
          if (error instanceof ApiClientError) {
            if (error.status === 401 || error.status === 403) return false;
            if (error.status === 404) return false;
          }
          return failureCount < 1;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Global logging hook — replace with toast/logger
        if (error instanceof ApiClientError && error.status !== 401) {
          console.error(`[Query Error] ${query.queryHash}`, error.message);
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (error instanceof ApiClientError && error.status !== 401) {
          console.error("[Mutation Error]", error.message);
        }
      },
    }),
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
