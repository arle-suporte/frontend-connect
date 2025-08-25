import { authenticatedFetch } from "@/lib/api-client";
import { ContactType } from "@/types/chat";

export const initiateService = async (currentService: any, contact: ContactType) => {
  try {
    let endpoint;
    let body = {};

    if (currentService?.uuid && currentService.status === 'pending') {
      endpoint = `/whatsapp/service/${currentService.uuid}/iniciar`;
    } else {
      endpoint = '/whatsapp/service/iniciar-novo';
      body = {
        contact: contact.uuid,
        chat_id: contact.phone_number,
        status: 'in_progress',
      };
    }

    const response = await authenticatedFetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (response.ok) {
      alert('Atendimento iniciado com sucesso');
      return data;
    } else {
      console.error('Erro:', data.detail);
    }
  } catch (error) {
    console.error('Erro ao iniciar atendimento:', error);
  }
};