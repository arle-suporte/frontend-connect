import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function PUT(request: NextRequest) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const body = await request.json()

  try {
    const searchParams = request.nextUrl.searchParams;
    const responseUuid = searchParams.get('response');

    if (!responseUuid) {
      return NextResponse.json(
        { detail: "Parâmetro response é obrigatório" },
        { status: 400 }
      );
    }

    const res = await fetch(`${API_URL}/setting/response/${responseUuid}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error("Erro ao excluir resposta:", error);
    return NextResponse.json(
      { detail: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}