import { authenticatedFetch } from "@/lib/api-client";
import { toast } from "sonner";

interface UpdateProfilePayload {
  avatar?: File | null;
  new_password?: string;
  confirm_password?: string;
}

export async function updateProfile(data: UpdateProfilePayload) {
  const formData = new FormData();

  if (data.avatar) {
    formData.append("avatar", data.avatar);
  }
  if (data.new_password) {
    formData.append("new_password", data.new_password);
    formData.append("confirm_password", data.confirm_password || "");
  }

  const response = await authenticatedFetch("/auth/profile/", {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw { status: response.status, data: errorData };
  }

  toast.success("Perfil atualizado com sucesso!");
  return await response.json();
}
