import { z } from "zod";

export const InsertBahanKimiaSchema = z.object({
  id_installasi: z.number(),
  tanggal: z.string(),
  id_petugas: z.number(),
  jenis: z.string(),
  nilai: z.number(),
  keterangan: z.string().nullable(),
});

export type InsertBahanKimiaRequest = z.infer<typeof InsertBahanKimiaSchema>;
