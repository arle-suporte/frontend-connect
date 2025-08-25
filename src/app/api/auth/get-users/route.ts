import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function GET() {
  const { access, error } = await checkAuth();
  if (error) return error;

  const res = await fetch(`${API_URL}/customers/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    return new Response(
      JSON.stringify({
        detail: errorData.detail || "Erro ao carregar conversas",
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