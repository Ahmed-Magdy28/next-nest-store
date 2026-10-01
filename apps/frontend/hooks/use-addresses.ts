"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  CreateAddressDto,
  UpdateAddressDto,
} from "@repo/shared/dtos/addresses";

import { addressesApi } from "../lib/api/addresses/addresses";
import { queryKeys } from "../lib/api/e-commerce/query-keys";

export function useAddresses() {
  return useQuery({
    queryKey: queryKeys.addresses,
    queryFn: addressesApi.list,
    staleTime: 1000 * 60, // 1 min
  });
}

export function useCreateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAddressDto) => addressesApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.addresses });
      toast.success("Address added successfully");
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Failed to add address"),
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateAddressDto }) =>
      addressesApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.addresses });
      toast.success("Address updated successfully");
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Failed to update address"),
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.addresses });
      toast.success("Address removed");
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Failed to remove address"),
  });
}

export function useSetDefaultAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressesApi.setDefault(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.addresses });
      toast.success("Default address updated");
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Failed to set default address"),
  });
}
