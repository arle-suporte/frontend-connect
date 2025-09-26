import { authenticatedFetch } from "@/lib/api-client";
import { buildQueryString } from "@/lib/build-query-string";


export async function getDepartments(filters: any, page: number, size: number): Promise<any> {
  const queryString = buildQueryString(filters, page, size);

  const response = await authenticatedFetch(`/auth/department/get-departments?${queryString}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    throw new Error(data?.detail || "Erro ao carregar departamentos");
  }

  return data;
}