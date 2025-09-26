// frontend-connect/src/services/user/create-user.ts
import { authenticatedFetch } from "@/lib/api-client";
import { toast } from "sonner";
import { UserFormData } from "@/schemas/user";

export const createUser = async (data: UserFormData) => {
  const body = new FormData();

  body.append("name", data.name);
  body.append("email", data.email);
  body.append("role", data.role);
  body.append("status", data.status);

  if (data.birthday) body.append("birthday", data.birthday);
  if (data.extension_number)
    body.append("extension_number", data.extension_number);

  if (data.avatar instanceof File) {
    body.append("avatar", data.avatar);
  }

  if (data.position?.uuid) body.append("position", data.position.uuid);
  if (data.immediate_superior?.uuid)
    body.append("immediate_superior", data.immediate_superior.uuid);

  if (Array.isArray(data.permissions)) {
    data.permissions.forEach((p) => {
      if (p.uuid) body.append("permissions", p.uuid);
    });
  }

  const response = await authenticatedFetch("/auth/user/create-user/", {
    method: "POST",
    body,
  });

  if (!response.ok) {
    let errorMsg = "Erro ao criar colaborador.";
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorMsg;
    } catch (_) {}
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }

  toast.success("Colaborador criado com sucesso!");
  return await response.json();
};
