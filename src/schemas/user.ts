import { z } from "zod";

export const RoleEnum = z.enum(["owner", "admin", "member"]);
export const StatusEnum = z.enum([
  "active",
  "inactive",
  "vacation",
  "sick_leave",
  "suspended",
  "training",
  "onboarding",
  "dismissed",
]);

export const userSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255),
  email: z.string().email("E-mail inválido").max(254),

  avatar: z.any().nullable().optional(),
  current_avatar: z.string().optional(),

  extension_number: z
    .string()
    .max(12, "Máximo 12 caracteres")
    .nullable()
    .optional(),

  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido, use YYYY-MM-DD")
    .nullable()
    .or(z.literal(""))
    .optional(),

  role: RoleEnum,
  status: StatusEnum.default("active"),

  role_help_text: z.string().optional().nullable(),
  status_help_text: z.string().optional().nullable(),

  is_staff: z.boolean().optional(),
  is_active: z.boolean().optional(),
  is_deleted: z.boolean().optional(),

  date_joined: z.string().datetime().optional(),

  position: z
    .object({
      uuid: z.string().uuid(),
      name: z.string(),
    })
    .nullable()
    .optional(),

  immediate_superior: z
    .object({
      uuid: z.string().uuid(),
      name: z.string(),
      email: z.string().email(),
    })
    .nullable()
    .optional(),

  permissions: z
    .array(
      z.object({
        uuid: z.string().uuid(),
        codename: z.string(),
        description: z.string().nullable().optional(),
      })
    )
    .optional(),
});

export type UserFormData = Omit<z.infer<typeof userSchema>, "avatar"> & {
  avatar?: File | string | null;
  current_avatar?: string;
};
