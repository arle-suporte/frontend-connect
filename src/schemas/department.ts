import { z } from "zod";

export const departmentSchema = z.object({
  name: z
    .string()
    .min(2, "O nome do departamento deve ter pelo menos 2 caracteres")
    .nonempty("O nome é obrigatório"),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;
