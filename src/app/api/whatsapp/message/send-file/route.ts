import { checkAuth } from "@/utils/checkAuth";
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/constants";

export async function POST(req: Request) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const formData = await req.formData();

  const headers = {
    Authorization: `Bearer ${access}`,
  };

  const res = await fetch(`${API_URL}/whatsappapi/send-file/`, {
    method: "POST",
    body: formData,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    return new Response(
      JSON.stringify({
        detail: errorData.detail || "Erro ao enviar arquivo.",
      }),
      {
        status: res.status,
      }
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
