import { authenticatedFetch } from "@/lib/api-client";
import { toast } from "sonner";

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
      toast.warning('Atendimento desconsiderado');
      return data;
    } else {
      toast.error('Erro ao desconsiderar atendimento:');
      throw new Error(data.detail || 'Erro ao desconsiderar atendimento');
    }
  } catch (error) {
    throw error;
  }
}