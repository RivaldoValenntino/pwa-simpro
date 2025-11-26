import { z } from "zod";

export const InsertPompAmpSchema = z.object({
  id: z.number(),
  id_petugas: z.number(),
  hz: z.coerce.number({}),
  filename: z.string().nullable(),
  latlong: z.string(),
  waktu_catat: z.string(),

  pompa_list: z.array(
    z.object({
      urutan: z.number(),
      status_on: z.union([z.literal(0), z.literal(1)]),
      nilai: z.number().nullable(),
      filename: z.string().nullable(),
    })
  ),
});

export type InsertPompAmpRequest = z.infer<typeof InsertPompAmpSchema>;
