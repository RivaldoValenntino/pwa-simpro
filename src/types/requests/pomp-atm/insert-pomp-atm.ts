import { z } from "zod";

export const InsertPompAtmSchema = z.object({
  id: z.number(),
  id_petugas: z.number(),
  atm: z.coerce.number({
  }),
  filename: z.string().nullable(),
  latlong: z.string(),
  waktu_catat: z.string(),
});

export type InsertPompAtmRequest = z.infer<typeof InsertPompAtmSchema>;
