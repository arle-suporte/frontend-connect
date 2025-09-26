import { authenticatedFetch } from "@/lib/api-client";
import { toast } from "sonner";

export const reactivateUser = async (userUuid: string) => {
  const response = await authenticatedFetch('/auth/user/reactivate-user', {
    method: 'POST',
    body: JSON.stringify({
      uuid: userUuid
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    toast.error(errorData.detail || 'Erro ao restaurar colaborador.');
    throw new Error(errorData.detail || 'Erro ao restaurar colaborador.');
  }

  toast.success('Colaborador restaurado com sucesso!');
  return await response.json();
};
