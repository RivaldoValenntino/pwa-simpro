import { z } from "zod";

export const InsertKimiaSchema = z.object({
  id: z.number(),
  id_petugas: z.number(),
  type: z.string().nullable(),
  dosis: z.coerce.number({
    }),
  dosring: z.coerce.number({
    }),
  cons: z.coerce.number({
    }),
  filename: z.string().nullable().optional(),
  waktu_catat: z.string(),
});

export type InsertKimiaRequest = z.infer<typeof InsertKimiaSchema>;
