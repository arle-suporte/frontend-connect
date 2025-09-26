import { authenticatedFetch } from "@/lib/api-client";
import { toast } from "sonner";
import { UserFormData } from "@/schemas/user";

export const editUser = async (data: UserFormData & { uuid: string }) => {
  const body = new FormData();

  console.log(data);

  body.append("name", data.name);
  body.append("email", data.email);
  body.append("role", data.role);
  body.append("status", data.status);

  if (data.birthday) body.append("birthday", data.birthday);
  if (data.extension_number)
    body.append("extension_number", data.extension_number);

  if (data.avatar instanceof File) {
    body.append("avatar", data.avatar);
  } else if (data.avatar === null && !data.current_avatar) {
    body.append("avatar", "");
  }

  if (data.position?.uuid) {
    body.append("position", data.position.uuid);
  } else {
    body.append("position", "");
  }

  if (data.immediate_superior?.uuid) {
    body.append("immediate_superior", data.immediate_superior.uuid);
  } else {
    body.append("immediate_superior", "");
  }
  if (Array.isArray(data.permissions)) {
    data.permissions.forEach((p) => {
      if (p.uuid) body.append("permissions", p.uuid);
    });
  }

  const response = await authenticatedFetch(
    `/auth/user/edit-user/${data.uuid}`,
    {
      method: "PUT",
      body,
    }
  );

  if (!response.ok) {
    let errorMsg = "Erro ao editar colaborador.";
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorMsg;
    } catch (_) {}
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }

  toast.success("Colaborador editado com sucesso!");
  return await response.json();
};
