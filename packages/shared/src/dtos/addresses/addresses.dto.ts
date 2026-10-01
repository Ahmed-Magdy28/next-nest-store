import { z } from "zod";
import { createAddressSchema, updateAddressSchema } from "../../schemas/addresses";

export type CreateAddressDto = z.infer<typeof createAddressSchema>;
export type UpdateAddressDto = z.infer<typeof updateAddressSchema>;

export interface AddressDto {
  id: string;
  userId: string;
  label: string | null;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  area: string | null;
  street: string;
  building: string | null;
  apartment: string | null;
  postalCode: string | null;
  isDefault: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}
