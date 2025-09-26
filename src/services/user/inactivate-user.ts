import { authenticatedFetch } from "@/lib/api-client";
import { toast } from "sonner";

export const inactivateUser = async (userUuid: string) => {
  const response = await authenticatedFetch('/auth/user/inactivate-user', {
    method: 'DELETE',
    body: JSON.stringify({
      uuid: userUuid
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    toast.error(errorData.detail || 'Erro ao inativar contato.');
    
    throw new Error(errorData.detail || 'Erro ao inativar contato.');
  }

  toast.warning('Colaborador inativado com sucesso');
  return await response.json();
};
