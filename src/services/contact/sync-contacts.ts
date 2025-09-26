import { authenticatedFetch } from "@/lib/api-client";
import { toast } from "sonner";

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

    const data = await response.json();

    toast.success(
      `${data?.message || "Algo deu errado na sincronização!"}: criados: ${
        data?.created ?? 0
      } e atualizados: ${data?.updated ?? 0}`
    );

    return data;
  } catch (error) {
    console.error("Erro na sincronização de contatos:", error);
    toast.error("Erro ao sincronizar contatos");
    throw error;
  }
};
