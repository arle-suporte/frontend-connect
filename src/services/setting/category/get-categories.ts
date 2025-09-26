import { authenticatedFetch } from "@/lib/api-client";

export const getCategories = async () => {
  try {
    const response = await authenticatedFetch(`/setting/category/get-categories`);

    if (!response.ok) {
      throw new Error(`Erro ao buscar categorias: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (err) {
    console.error('Erro ao buscar categorias:', err);
    throw err;
  }
}