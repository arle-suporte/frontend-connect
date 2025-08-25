import { authenticatedFetch } from "@/lib/api-client";

export const transferService = async (serviceUuid: string, novo_colaborador: string) => {
  try {
    const response = await authenticatedFetch(`/whatsapp/service/${serviceUuid}/transferir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ novo_colaborador: novo_colaborador }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Atendimento transferido');
      return data;
    } else {
      console.error('Erro ao transferir atendimento:', data.detail);
      throw new Error(data.detail || 'Erro ao transferir atendimento');
    }
  } catch (error) {
    console.error('Erro ao transferir atendimento:', error);
    throw error;
  }
}