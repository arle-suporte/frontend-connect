import { authenticatedFetch } from "@/lib/api-client";
import { buildQueryString } from "@/lib/build-query-string";

export async function fetchAuthClients(filters: any, page: number, size: number): Promise<any> {
  const queryString = buildQueryString(filters, page, size);

  const response = await authenticatedFetch(`/auth/client/get-clients?${queryString}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    throw new Error(data?.detail || "Erro ao carregar clientes");
  }

  return data;
}
