import { z } from "zod";

export const InsertMeterSchema = z.object({
  id: z.number(),
  id_petugas: z.number(),
  stand_awal: z.coerce.number({
    }),
  stand_akhir: z.coerce.number({
  }),
  filename: z.string().nullable(),
  latlong: z.string(),
  waktu_catat: z.string(),
});

export type InsertMeterRequest = z.infer<typeof InsertMeterSchema>;
