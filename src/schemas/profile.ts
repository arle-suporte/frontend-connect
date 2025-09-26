import { z } from "zod";

export const profileSchema = z
  .object({
    avatar: z.any().nullable().optional(),

    new_password: z
      .string()
      .min(6, "A nova senha deve ter no mínimo 6 caracteres")
      .optional()
      .or(z.literal("")),

    confirm_password: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => !data.new_password || data.new_password === data.confirm_password,
    {
      message: "As senhas não coincidem",
      path: ["confirm_password"],
    }
  );

export type ProfileFormData = z.infer<typeof profileSchema>;
