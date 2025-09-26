import { authenticatedFetch } from "@/lib/api-client";
import { buildQueryString } from "@/lib/build-query-string";
import { toast } from "sonner";


export const getGroupsPaginated = async (
  filters: any,
  page: number,
  size: number
) => {
  try {
    const queryString = buildQueryString(filters, page, size);
    const response = await authenticatedFetch(
      `/whatsapp/contact/get-groups?${queryString}`
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar grupos: ${response.status}`);
    }

    const data = await response.json();
    console.log("Grupos buscados:", data);
    return data;
  } catch (err) {
    toast.error("Erro ao buscar grupos:");
    throw err;
  }
};
