import { z } from "zod";

export const InsertMeterPLNSchema = z.object({
  id: z.number(),
  id_petugas: z.number(),
  nilai: z.coerce.number({
    }),
  filename: z.string().nullable().optional(),
  latlong: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  waktu_catat: z.string().nullable().optional(),
});

export type InsertMeterPLNRequest = z.infer<typeof InsertMeterPLNSchema>;
