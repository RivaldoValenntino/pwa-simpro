import { z } from "zod";

export const PompaItemSchema = z.object({
  urutan: z.number(), // pompa ke berapa (1, 2, dst)
  nilai: z.coerce.number().nullable().optional(),
  filename: z.string().nullable().optional(),
});

export const InsertHoursPompaSchema = z.object({
  id_installasi: z.number(),
  id_petugas: z.number(),
  id_pompa: z.number({
    required_error: "Pompa harus dipilih",
    invalid_type_error: "Pompa harus dipilih",
  }),
  pompa_list: z.array(PompaItemSchema), // ✅ bulk data pompa
});

export type InsertHoursPompaRequest = z.infer<typeof InsertHoursPompaSchema>;
