import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function PUT(
  request: Request,
  context: { params: Promise<{ uuid: string }> }
) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const { uuid } = await context.params;

  if (!uuid) {
    return new Response(JSON.stringify({ detail: "Usuário é obrigatório" }), {
      status: 400,
    });
  }

  const formData = await request.formData();

  const backendFormData = new FormData();
  for (const [key, value] of formData.entries()) {
    backendFormData.append(key, value);
  }

  const res = await fetch(`${API_URL}/customers/${uuid}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${access}`,
    },
    body: backendFormData,
  });

  if (!res.ok) {
    let errorMsg = "Erro ao editar colaborador";
    try {
      const errorData = await res.json();
      errorMsg = errorData.detail || errorMsg;
    } catch (_) {}
    return new Response(JSON.stringify({ detail: errorMsg }), {
      status: res.status,
    });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), { status: 200 });
}
