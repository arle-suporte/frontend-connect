import { authenticatedFetch } from "@/lib/api-client";

export const createResponse = async (subtitle: string, description: string, categoryUuid: string) => {
  const response = await authenticatedFetch('/setting/response/create-response', {
    method: 'POST',
    body: JSON.stringify({
      subtitle: subtitle,
      description: description,
      category: categoryUuid
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao criar categoria.');
  }

  return await response.json();
};
