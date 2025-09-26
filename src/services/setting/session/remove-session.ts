
import { authenticatedFetch } from "@/lib/api-client";

export async function removeSession(): Promise<any> {
  try {
    const response = await authenticatedFetch("/whatsapp/session/remove", {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Falha ao remover sessão");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}