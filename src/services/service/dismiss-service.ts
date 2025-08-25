import { authenticatedFetch } from "@/lib/api-client";

export const dismissService = async (serviceUuid: string) => {
  try {
    const response = await authenticatedFetch(`/whatsapp/service/${serviceUuid}/desconsiderar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      alert('Atendimento desconsiderado');
      return data;
    } else {
      throw new Error(data.detail || 'Erro ao desconsiderar atendimento');
    }
  } catch (error) {
    throw error;
  }
}