import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function GET(request: Request) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const { search } = new URL(request.url)

  const res = await fetch(`${API_URL}/customers/${search}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    return new Response(
      JSON.stringify({
        detail: errorData.error.detail || "Erro ao buscar usuários",
      }),
      {
        status: res.status,
      }
    );
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: 200,
  });
}