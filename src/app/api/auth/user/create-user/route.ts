// frontend-connect/src/app/api/auth/user/create-user/route.ts
import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function POST(request: Request) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const formData = await request.formData();

  const backendFormData = new FormData();
  for (const [key, value] of formData.entries()) {
    backendFormData.append(key, value);
  }

  const res = await fetch(`${API_URL}/customers/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access}`,
    },
    body: backendFormData,
  });

  if (!res.ok) {
    let errorMsg = "Erro ao criar colaborador";
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
