import { authenticatedFetch } from "@/lib/api-client";

export const editResponse = async (responseUuid: string, description: string, categoryUuid: string, subtitle?: string,) => {
  try {
    const response = await authenticatedFetch(`/setting/response/edit-response?response=${responseUuid}`, {
      method: 'PUT',
      body: JSON.stringify({
        category: categoryUuid,
        subtitle: subtitle,
        description: description,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erro ao criar categoria.');
    }

    return await response.json();

  } catch (err) {
    console.error('Erro ao excluir resposta:', err);
    throw err;
  }
}