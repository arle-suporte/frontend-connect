import { authenticatedFetch } from "@/lib/api-client";
import { toast } from "sonner";

export const createContact = async (
  name: string,
  phone_number: string,
  client: string
) => {
  const response = await authenticatedFetch(
    "/whatsapp/contact/create-contact",
    {
      method: "POST",
      body: JSON.stringify({
        name: name,
        phone_number: phone_number + "@c.us",
        client: client,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao criar contato.");
  }

  toast.success("Contato criado com sucesso!");
  return await response.json();
};
