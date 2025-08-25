import { authenticatedFetch } from "@/lib/api-client";

export const syncContacts = async () => {
  try {
    const response = await authenticatedFetch(
      "/whatsapp/contact/sync-contacts",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao sincronizar contatos");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na sincronização de contatos:", error);
    throw error;
  }
};
