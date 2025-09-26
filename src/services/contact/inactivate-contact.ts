import { authenticatedFetch } from "@/lib/api-client";
import { toast } from "sonner";

export const inactivateContact = async (contactUuid: string) => {
  const response = await authenticatedFetch('/whatsapp/contact/inactivate-contact', {
    method: 'DELETE',
    body: JSON.stringify({
      uuid: contactUuid
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao inativar contato.');
  }

  toast.warning('Contato inativado com sucesso!')
  return await response.json();
};
