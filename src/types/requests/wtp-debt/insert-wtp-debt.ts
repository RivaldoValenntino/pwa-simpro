import { z } from "zod";

export const InsertWtpDebtSchema = z.object({
  id: z.number(),
  id_petugas: z.number(),
  debit_ld: z.coerce.number({
  }),
  filename: z.string().nullable(),
  latlong: z.string(),
  waktu_catat: z.string(),
});

export type InsertWtpDebtRequest = z.infer<typeof InsertWtpDebtSchema>;
