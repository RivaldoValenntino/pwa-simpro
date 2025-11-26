import { z } from "zod";

export const UpdateAnomaliSchema = z.object({
  id_anomali: z.number(),
  id_petugas: z.number(),
  feedback: z.string().nullable().optional(),
  foto: z.string().nullable().optional(),
});

export type UpdateAnomaliRequest = z.infer<typeof UpdateAnomaliSchema>;
