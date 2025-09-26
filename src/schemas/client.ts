import { z } from "zod";

export const clientSchema = z.object({
  uuid: z.string().uuid().optional(),
  federal_registration: z
    .string()
    .min(11, "CNPJ inválido")
    .max(18, "CNPJ inválido"),
  company_name: z.string().min(2, "Razão Social é obrigatória"),
  trade_name: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["undefined", "client", "former_client"]),
  company_type: z.enum(["undefined", "head_office", "branch_office"]),
  contact_name: z.string().min(2, "Nome do contato é obrigatório"),
  contact_email: z.string().superRefine((val, ctx) => {
    if (!val) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      ctx.addIssue({
        code: "custom",
        message: "E-mail inválido",
      });
    }
  }),
  contact_phone: z.string().optional(),
  social_responsible: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
