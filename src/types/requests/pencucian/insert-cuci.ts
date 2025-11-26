import { z } from "zod";

export const InsertPencucianSchema = z.object({
  id: z.number(),
  id_petugas: z.number(),
  jenis: z.string(),
  latlong: z.string(),
  waktu_catat: z.string(),
  item_list: z.array(
    z.object({
      id_trans_pencucian: z.number(),
      urut_ke: z.number(),
      jenis: z.string(),
      nilai: z.number().nullable(),
    })
  ),
});

export type InsertPencucianRequest = z.infer<typeof InsertPencucianSchema>;
