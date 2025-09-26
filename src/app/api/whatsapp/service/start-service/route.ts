import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const { access, error } = await checkAuth();
  if (error) return error;

  try {
    const body = await request.json();

    const res = await fetch(`${API_URL}/service/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro ao iniciar novo atendimento:", error);
    return NextResponse.json(
      { detail: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
