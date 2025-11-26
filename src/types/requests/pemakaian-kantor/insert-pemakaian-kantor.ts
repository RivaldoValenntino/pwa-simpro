import { z } from "zod";

export const InsertPemakaianKantorSchema = z.object({
  id_installasi: z.number(),
  id_petugas: z.number(),
  tanggal: z.string(),
  id_meter_pemakaian: z.number({
    required_error: "Jenis Meter harus dipilih",
    invalid_type_error: "Jenis Meter harus dipilih",
  }),
  stand_awal: z
    .number(),
  stand_akhir: z
    .number(),
  file: z.string().nullable(),
});

export type InsertPemakaianKantorRequest = z.infer<
  typeof InsertPemakaianKantorSchema
>;
