import { z } from "zod";

export const InsertDosisSchema = z.object({
  id: z.number(),
  id_petugas: z.number(),
  ppm:  z.coerce.number({
    }),
  sisa_khlor: z.coerce.number({
    }),
  filename_khlor: z.string().nullable(),
  latlong_khlor: z.string(),
  waktu_catat_khlor: z.string(),
});

export type InsertDosisRequest = z.infer<typeof InsertDosisSchema>;
