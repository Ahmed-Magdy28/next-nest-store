"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "../lib/api/e-commerce/query-keys";
import { sessionsApi } from "../lib/api/sessions/sessions";

export function useSessions() {
  return useQuery({
    queryKey: queryKeys.sessions,
    queryFn: sessionsApi.list,
    staleTime: 1000 * 30,
  });
}

export function useRevokeSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sessionsApi.revoke(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sessions });
      toast.success("Session revoked");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });
}

export function useRevokeAllSessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sessionsApi.revokeAll,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sessions });
      toast.success("All other sessions revoked");
    },
  });
}
