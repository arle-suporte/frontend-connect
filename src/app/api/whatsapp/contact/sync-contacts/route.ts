import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function GET() {
  const { access, error } = await checkAuth();
  if (error) return error;

  const res = await fetch(`${API_URL}/whatsappapi/sync-contacts/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  const raw = await res.text();
  let data: any;

  try {
    data = JSON.parse(raw);
  } catch {
    data = { detail: raw };
  }

  if (!res.ok) {
    return new Response(
      JSON.stringify({
        detail: data.detail || "Erro ao sincronizar contatos",
      }),
      { status: res.status }
    );
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
