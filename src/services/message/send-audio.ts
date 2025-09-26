import { authenticatedFetch } from "@/lib/api-client";

export async function sendAudio(chatId: string, file: File, contact: any) {
  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append("file", file, file.name);

  const res = await authenticatedFetch("/whatsapp/message/send-file/", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Erro ao enviar áudio: ${txt}`);
  }

  return res.json();
}
