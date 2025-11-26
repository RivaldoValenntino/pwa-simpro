import { z } from "zod";

export const InsertSungaiSchema = z.object({
  id: z.number().optional(),
  id_petugas: z.number().optional(),
  level_sungai: z.coerce.number({
  }).optional(),
  filename: z.string().nullable().optional(),
  latlong: z.string().optional(),
  waktu_catat: z.string().optional(),
});

export type InsertSungaiRequest = z.infer<typeof InsertSungaiSchema>;
