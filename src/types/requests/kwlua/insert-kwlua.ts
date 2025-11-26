import { z } from "zod";

export const InsertKwluaSchema = z.object({
  id: z.number(),
  id_petugas: z.number(),
  type: z.string().nullable(),
  ntu: z.coerce.number({
    }),
  ph: z.coerce.number({
    }),
  file_ntu: z.string().nullable(),
  file_ph: z.string().nullable(),
  waktu_catat: z.string(),
});

export type InsertKwluaRequest = z.infer<typeof InsertKwluaSchema>;
