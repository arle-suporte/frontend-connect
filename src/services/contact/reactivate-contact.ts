import { authenticatedFetch } from "@/lib/api-client";
import { toast } from "sonner";

export const reactivateContact = async (contactUuid: string) => {
  const response = await authenticatedFetch('/whatsapp/contact/reactivate-contact', {
    method: 'POST',
    body: JSON.stringify({
      uuid: contactUuid
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao restaurar contato.');
  }

  toast.success('Contato reativado com sucesso!');
  return await response.json();
};
