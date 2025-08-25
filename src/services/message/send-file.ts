import { authenticatedFetch } from "@/lib/api-client";
import { ContactType } from "@/types/chat";

export const sendFile = async (serviceUuid: string, file: File, selectedContact: ContactType) => {
  const formData = new FormData();
  formData.append('chat_id', selectedContact.phone_number);
  formData.append('file', file);

  try {
    const response = await authenticatedFetch('/whatsapp/message/send-file/', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail);
    }

    const data = await response.json();
    console.log("Arquivo enviado:", data);
  } catch (err) {
    console.error('Erro ao enviar arquivo:', err);
  }
}