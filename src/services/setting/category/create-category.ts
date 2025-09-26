import { authenticatedFetch } from "@/lib/api-client";

export const createCategory = async (title: string) => {
  const response = await authenticatedFetch('/setting/category/create-category', {
    method: 'POST',
    body: JSON.stringify({
      title: title,
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao criar categoria.');
  }

  return await response.json();
};
