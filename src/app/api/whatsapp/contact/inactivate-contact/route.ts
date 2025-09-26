import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function DELETE(request: Request) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const body = await request.json();
  const { uuid } = body;

  if (!uuid) {
    return new Response(
      JSON.stringify({
        detail: "UUID do contato é obrigatório",
      }),
      {
        status: 400,
      }
    );
  }

  const res = await fetch(`${API_URL}/contact/${uuid}/soft-delete/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return new Response(
      JSON.stringify({
        detail: "Erro ao inativar contato",
        status: res.status,
      }),
      {
        status: res.status,
      }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Contato inativado com sucesso",
      success: true,
    }),
    {
      status: 200,
    }
  );
}
