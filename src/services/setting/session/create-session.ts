
import { authenticatedFetch } from "@/lib/api-client";

export async function createSession(): Promise<any> {
  try {
    const response = await authenticatedFetch("/whatsapp/session/create", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Falha ao criar sessão");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}