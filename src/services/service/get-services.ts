import { authenticatedFetch } from "@/lib/api-client";
import { buildQueryString } from "@/lib/build-query-string";

export const getServicesPaginated = async (filters: any, page: number, size: number) => {
  try {
    const queryString = buildQueryString(filters, page, size);
    const response = await authenticatedFetch(`/whatsapp/service/get-services?${queryString}`);

    if (!response.ok) {
      throw new Error(`Erro ao buscar atendimentos: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (err) {
    console.error('Erro ao buscar atendimentos:', err);
    throw err;
  }
}