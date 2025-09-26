import { authenticatedFetch } from "@/lib/api-client";
import { toast } from "sonner";

export async function inactivateClient(clientUuid: string) {
  const response = await authenticatedFetch('/auth/client/inactivate-client', {
    method: 'PATCH',
    body: JSON.stringify({
      uuid: clientUuid
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao inativar cliente.');
  }

  toast.warning('Cliente inativado com sucesso!');
  return await response.json();
};
