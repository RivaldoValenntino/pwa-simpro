import { z } from "zod";

export const InsertAnomaliSchema = z.object({
  id_petugas: z.number(),
  id_installasi: z.number(),
  waktu: z.string(),
  tanggal: z.string(),
  resiko: z.string().min(1, "Resiko Anomali harus dipilih"),
  id_jenis_anomali: z.number({
    required_error: "Jenis Anomali harus dipilih",
    invalid_type_error: "Jenis Anomali harus dipilih",
  }),
  keterangan: z
    .string({
      required_error: "Keterangan harus diisi",
      invalid_type_error: "Keterangan harus diisi",
    })
    .min(1, { message: "Keterangan harus diisi" }),
  dampak: z
    .string({
      required_error: "Dampak harus diisi",
      invalid_type_error: "Dampak harus diisi",
    })
    .min(1, { message: "Dampak harus diisi" }),
  foto: z.string().nullable(),
});

export type InsertAnomaliRequest = z.infer<typeof InsertAnomaliSchema>;
