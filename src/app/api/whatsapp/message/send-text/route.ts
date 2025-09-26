import { checkAuth } from "@/utils/checkAuth";
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/constants";

export async function POST(req: Request) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const body = await req.json();

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access}`,
  };

  const res = await fetch(`${API_URL}/whatsappapi/send-message/`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    return new Response(
      JSON.stringify({
        detail: errorData.detail || "Erro ao enviar mensagem",
      }),
      {
        status: res.status,
      }
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
