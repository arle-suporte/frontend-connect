import { authenticatedFetch } from "@/lib/api-client";
import { ContactType } from "@/types/chat";
import { buildQueryString } from "@/lib/build-query-string";

export const getAllContacts = async (): Promise<ContactType[]> => {
  const response = await authenticatedFetch('/whatsapp/contact/get-contacts');

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao buscar contatos.');
  }

  return await response.json();
};


export const getContactsPaginated = async (filters: any, page: number, size: number) => {
  try {
    const queryString = buildQueryString(filters, page, size);
    const response = await authenticatedFetch(`/whatsapp/contact/get-contacts?${queryString}`);

    if (!response.ok) {
      throw new Error(`Erro ao buscar contatos: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (err) {
    console.error('Erro ao buscar contatos:', err);
    throw err;
  }
}
