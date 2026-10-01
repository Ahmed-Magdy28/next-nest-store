import { z } from "zod";

export const createAddressSchema = z.object({
  label: z.string().trim().max(50).optional().nullable(),
  fullName: z.string().trim().min(2, "Full name is too short").max(100),
  phone: z.string().trim().min(6, "Phone number is too short").max(30),
  country: z.string().trim().min(2).max(100).default("Egypt"),
  city: z.string().trim().min(2, "City is required").max(100),
  area: z.string().trim().max(100).optional().nullable(),
  street: z.string().trim().min(2, "Street address is required").max(255),
  building: z.string().trim().max(50).optional().nullable(),
  apartment: z.string().trim().max(50).optional().nullable(),
  postalCode: z.string().trim().max(20).optional().nullable(),
  isDefault: z.boolean().optional().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();
