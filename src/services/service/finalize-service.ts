import { authenticatedFetch } from "@/lib/api-client";
import { toast } from "sonner"

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
      toast.success('Atendimento finalizado');
      return data;
    } else {
      toast.error('Erro ao finalizar atendimento:');
      throw new Error(data.detail || 'Erro ao finalizar atendimento');
    }
  } catch (error) {
    throw error;
  }
}