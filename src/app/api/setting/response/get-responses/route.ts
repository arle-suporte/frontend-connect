import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const { access, error } = await checkAuth();
  if (error) return error;

  try {
    // Pegar o parâmetro de categoria da query string
    const searchParams = request.nextUrl.searchParams;
    const categoryUuid = searchParams.get('category');

    if (!categoryUuid) {
      return NextResponse.json(
        { detail: "Parâmetro category é obrigatório" },
        { status: 400 }
      );
    }

    const res = await fetch(`${API_URL}/setting/response/?category=${categoryUuid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro ao buscar respostas:", error);
    return NextResponse.json(
      { detail: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}