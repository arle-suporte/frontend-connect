import { authenticatedFetch } from "@/lib/api-client";

export const inactivateContact = async (contactUuid: string) => {
  const response = await authenticatedFetch('/whatsapp/contact/inactivate-contact', {
    method: 'POST',
    body: JSON.stringify({
      uuid: contactUuid
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao inativar contato.');
  }

  return await response.json();
};
