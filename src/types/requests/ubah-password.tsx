import { z } from "zod";

export const UbahPasswordSchema = z
  .object({
    id_user: z.number(),
    password_lama: z.string().min(4, "Password lama minimal 4 karakter"),
    password_baru: z.string().min(4, "Password baru minimal 4 karakter"),
    konfirmasi_password_baru: z
      .string()
      .min(4, "Konfirmasi password minimal 4 karakter"),
  })
  .refine((data) => data.password_baru === data.konfirmasi_password_baru, {
    path: ["konfirmasi_password_baru"],
    message: "Konfirmasi password tidak cocok",
  });

export type UbahPasswordType = z.infer<typeof UbahPasswordSchema>;
