import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function PATCH(request: Request) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const body = await request.json();
  const { uuid } = body;

  if (!uuid) {
    return new Response(
      JSON.stringify({
        detail: "UUID do cliente é obrigatório",
      }),
      {
        status: 400,
      }
    );
  }

  const res = await fetch(`${API_URL}/client/${uuid}/deactivate-client/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();

    return new Response(
      JSON.stringify({
        detail: errorData.error.detail,
        status: errorData.error.status,
      }),
      {
        status: res.status,
      }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Cliente inativado com sucesso",
      success: true,
    }),
    {
      status: 200,
    }
  );
}
