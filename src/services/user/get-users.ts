import { authenticatedFetch } from "@/lib/api-client";

export interface AuthUserOption {
  name: string
  uuid: string;
  email: string;
}

export async function fetchAuthUsers(): Promise<AuthUserOption[]> {
  const response = await authenticatedFetch(`/auth/get-users`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  console.log(data)

  if (!response.ok) {
    throw new Error(data?.detail || "Erro ao carregar usuários");
  }


  const list = Array.isArray(data?.results) ? data.results : [];
  const users: AuthUserOption[] = list
    .filter((u: any) => u?.uuid && u?.email)
    .map((u: any) => ({ uuid: u.uuid, email: u.email, name: u.name }))
    .sort((a: AuthUserOption, b: AuthUserOption) => a.email.localeCompare(b.email));

  return users;
}
