import type {
  AddressDto,
  CreateAddressDto,
  UpdateAddressDto,
} from "@repo/shared/dtos/addresses";
import { apiClient } from "../common/client";

export const addressesApi = {
  list: () => apiClient.get<AddressDto[]>("/addresses"),
  create: (body: CreateAddressDto) =>
    apiClient.post<AddressDto>("/addresses", body),
  update: (id: string, body: UpdateAddressDto) =>
    apiClient.patch<AddressDto>(`/addresses/${id}`, body),
  delete: (id: string) => apiClient.delete<void>(`/addresses/${id}`),
  setDefault: (id: string) =>
    apiClient.patch<AddressDto>(`/addresses/${id}/default`),
};
