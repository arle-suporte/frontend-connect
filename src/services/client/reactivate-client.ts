import { authenticatedFetch } from "@/lib/api-client";
import { toast } from "sonner";

export async function reactivateClient(clientUuid: string) {
  const response = await authenticatedFetch('/auth/client/reactivate-client', {
    method: 'PATCH',
    body: JSON.stringify({
      uuid: clientUuid
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao reativar cliente.');
  }

  toast.success('Cliente reativado com sucesso!')
  return await response.json();
};
