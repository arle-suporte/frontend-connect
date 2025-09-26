import { authenticatedFetch } from "@/lib/api-client";
import { toast } from "sonner";

export const editContact = async (
  contactUuid: string,
  contactName: string,
  contactPhoneNumber: string,
  client?: string
) => {
  const response = await authenticatedFetch("/whatsapp/contact/edit-contact", {
    method: "PUT",
    body: JSON.stringify({
      uuid: contactUuid,
      name: contactName,
      phone_number: contactPhoneNumber + "@c.us",
      client: client,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao editar contato.");
  }

  toast.success("Contato editado com sucesso!");
  return await response.json();
};
