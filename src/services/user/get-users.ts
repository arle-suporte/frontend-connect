import { authenticatedFetch } from "@/lib/api-client";
import { buildQueryString } from "@/lib/build-query-string";

export async function fetchAuthUsers(filters: any, page: number, size: number): Promise<any> {
  const queryString = buildQueryString(filters, page, size);

  const response = await authenticatedFetch(`/auth/user/get-users?${queryString}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    throw new Error(data?.detail || "Erro ao carregar usuários");
  }

  return data;
}


export async function fetchAllUsers(): Promise<any> {
  const response = await authenticatedFetch(`/auth/user/get-users?page_size=200`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    throw new Error(data?.detail || "Erro ao carregar usuários");
  }

  return data;
}
