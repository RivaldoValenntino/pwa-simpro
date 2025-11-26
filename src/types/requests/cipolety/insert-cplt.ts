import { z } from "zod";

export const InsertCipoletySchema = z.object({
  id: z.number().int(), // ID utama data trans
  id_petugas: z.number().int(), // Petugas pencatat

  cipolety1_tinggi: z.number().optional(),
  cipolety1_ld: z.number().optional(),

  cipolety2_tinggi: z.number().optional(),
  cipolety2_ld: z.number().optional(),

  file_cipolety1: z.string().nullable(),
  latlong_cipolety1: z.string(),
  waktu_catat_cipolety1: z.string().nullable(),

  file_cipolety2: z.string().nullable(),
  latlong_cipolety2: z.string(),
  waktu_catat_cipolety2: z.string().nullable(),
  type: z.string().nullable(),
});

export type InsertCipoletyRequests = z.infer<typeof InsertCipoletySchema>;
