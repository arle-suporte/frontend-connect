import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function POST(request: Request) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const body = await request.json();

  const res = await fetch(`${API_URL}/client/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json();
    return new Response(
      JSON.stringify({
        detail: errorData.error.detail || "Erro ao criar cliente",
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
