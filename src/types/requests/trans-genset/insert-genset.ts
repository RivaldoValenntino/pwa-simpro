import { z } from "zod";

export const InsertGensetSchema = z.object({
  id_petugas: z.number(),
  id_installasi: z.number(),
  tanggal: z.string(),
  ampere: z.number(),
  voltase: z.number(),
  solar: z.number(),
  durasi: z.number(),
  jenis: z.string(),
  filename: z.string().nullable().optional(),
});

export type InsertGensetRequest = z.infer<typeof InsertGensetSchema>;
