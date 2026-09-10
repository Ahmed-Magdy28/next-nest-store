"use client";

import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query";

import type { ReactNode } from "react";
import { cacheTimeInMinutes } from "@repo/shared/constants";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // تحديد وقت الكاش الافتراضي (5 دقائق كمثال)
        staleTime: 60 * 1000 * cacheTimeInMinutes,
        gcTime: 60 * 1000 * 10,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // على السيرفر: دايماً أنشئ client جديد لكل request
    return makeQueryClient();
  } else {
    // على العميل: احتفظ بنفس الـ client عشان ميعملش reset للـ cache مع الـ re-renders
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
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
