import { NextResponse } from "next/server";
import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function GET(request: Request) {
  const { access, error } = await checkAuth();
  if (error) return error;

  // Captura os query params da URL
  const { search } = new URL(request.url);

  try {
    // Repassa pro backend incluindo os mesmos query params
    const res = await fetch(`${API_URL}/contact/${search}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro ao buscar contatos:", error);
    return NextResponse.json(
      { detail: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}