import { authenticatedFetch } from "@/lib/api-client";

export const createContact = async (name: string, phone_number: string) => {
  const response = await authenticatedFetch('/whatsapp/contact/create-contact', {
    method: 'POST',
    body: JSON.stringify({
      name: name,
      phone_number: phone_number + '@c.us'
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao criar contato.');
  }

  return await response.json();
};
