import { authenticatedFetch } from "@/lib/api-client";

export async function getCommon<T>(endpoint: string): Promise<T[]> {
  const response = await authenticatedFetch(`/auth/common/${endpoint}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Erro ao buscar ${endpoint}`);
  }

  return response.json();
}
