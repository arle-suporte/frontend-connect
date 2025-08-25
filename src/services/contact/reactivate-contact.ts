import { authenticatedFetch } from "@/lib/api-client";

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

  return await response.json();
};
