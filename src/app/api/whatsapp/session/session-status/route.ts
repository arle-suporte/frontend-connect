import { checkAuth } from "@/utils/checkAuth";
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/constants";

export async function GET(req: Request) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access}`,
  };

  const res = await fetch(`${API_URL}/whatsappapi/session-status/`, {
    method: "GET",
    headers: headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    return new Response(
      JSON.stringify({
        detail: errorData.detail || "Erro ao encontrar dados da sessão",
      }),
      {
        status: res.status,
      }
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}