import { authenticatedFetch } from "@/lib/api-client";

export const finalizeService = async (serviceUuid: string) => {
  try {
    const response = await authenticatedFetch(`/whatsapp/service/${serviceUuid}/finalizar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      alert('Atendimento finalizado');
      return data;
    } else {
      console.error('Erro ao finalizar atendimento:', data.detail);
      throw new Error(data.detail || 'Erro ao finalizar atendimento');
    }
  } catch (error) {
    throw error;
  }
}