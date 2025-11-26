import { z } from "zod";

export const InsertReservoarSchema = z.object({
  id: z.number().optional(),
  id_petugas: z.number().optional(),
  level_air: z.coerce.number({
  }).optional(),
  filename_level: z.string().nullable().optional(),
  latlong_level: z.string().optional(),
  waktu_catat_level: z.string().optional(),
});

export type InsertReservoarRequest = z.infer<typeof InsertReservoarSchema>;
