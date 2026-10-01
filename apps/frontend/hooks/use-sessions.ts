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
      toast.success("Session ended");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to end session"),
  });
}

export function useDeleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sessionsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sessions });
      toast.success("Session removed");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to remove session"),
  });
}

export function useRevokeOtherSessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sessionsApi.revokeOthers,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sessions });
      toast.success("All other sessions logged out");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to log out other sessions"),
  });
}

export function useDeleteOtherSessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sessionsApi.deleteOthers,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sessions });
      toast.success("All other sessions deleted");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to delete other sessions"),
  });
}

export function useRevokeAllSessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sessionsApi.revokeAll,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sessions });
      toast.success("All sessions revoked");
    },
  });
}
