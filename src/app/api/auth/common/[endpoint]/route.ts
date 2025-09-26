import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function GET(
  request: Request,
  context: { params: Promise<{ endpoint: string }> }
) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const { endpoint } = await context.params;

  const res = await fetch(`${API_URL}/${endpoint}/common/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    return new Response(
      JSON.stringify({
        detail: errorData.detail || `Erro ao buscar dados de ${endpoint}`,
      }),
      {
        status: res.status,
      }
    );
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), { status: 200 });
}
