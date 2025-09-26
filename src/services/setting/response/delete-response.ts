import { authenticatedFetch } from "@/lib/api-client";

export const deleteResponse = async (responseUuid: string) => {
  try {
    const response = await authenticatedFetch(`/setting/response/delete-response?response=${responseUuid}`, {
      method: 'DELETE'
    });

    if (response.status === 204) {
      return null;
    }

    // Se o status não for 204, verifica se foi bem-sucedido
    if (response.status !== 200) {
      throw new Error(`Erro ao excluir resposta: ${response.status}`);
    }

    // Se houver um corpo de resposta, converte para JSON
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Erro ao excluir resposta:', err);
    throw err;
  }
}