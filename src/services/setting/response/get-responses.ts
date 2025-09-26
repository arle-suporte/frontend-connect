
import { authenticatedFetch } from "@/lib/api-client";

export const getCategoryResponses = async (categoryUuid: string) => {
  try {
    const response = await authenticatedFetch(`/setting/response/get-responses?category=${categoryUuid}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar respostas da categoria: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Erro ao buscar respostas da categoria:', err);
    throw err;
  }
}