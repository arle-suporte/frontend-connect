import { checkAuth } from "@/utils/checkAuth";
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/constants";

export async function POST(req: Request) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access}`,
  };

  const res = await fetch(`${API_URL}/whatsappapi/create-session/`, {
    method: "POST",
    body: JSON.stringify({}), // Body vazio se não precisar de dados
    headers: headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    return new Response(
      JSON.stringify({
        detail: errorData.detail || "Erro ao criar sessão",
      }),
      {
        status: res.status,
      }
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
