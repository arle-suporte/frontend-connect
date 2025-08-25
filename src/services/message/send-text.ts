import { authenticatedFetch } from "@/lib/api-client";
import { ContactType } from "@/types/chat";

export const sendText = async (serviceUuid: string, text: string, selectedContact: ContactType,) => {
  try {
    const response = await authenticatedFetch('/whatsapp/message/send-text/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify
        ({
          chat_id: selectedContact.phone_number,
          text: text,
          has_media: false,
          media_type: null,
          media_url: null
        }),
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar mensagem.');
    }

  } catch (err) {
    console.error('Erro ao enviar mensagem:', err);
  }
}