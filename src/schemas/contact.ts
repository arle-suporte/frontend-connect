import { z } from "zod";

export const contactSchema = z.object({
  uuid: z.string().uuid().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z
    .string()
    .min(10, "Número de telefone inválido")
    .regex(/^[0-9]+$/, "Somente números são permitidos"),
  client: z.string().uuid("Cliente inválido").optional().or(z.literal("")),
});

export type ContactFormData = z.infer<typeof contactSchema>;
