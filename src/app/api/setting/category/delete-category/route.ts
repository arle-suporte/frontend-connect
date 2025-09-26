import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function DELETE(request: NextRequest) {
  const { access, error } = await checkAuth();
  if (error) return error;

  try {
    const searchParams = request.nextUrl.searchParams;
    const responseUuid = searchParams.get('category');

    if (!responseUuid) {
      return NextResponse.json(
        { detail: "Parâmetro categoria é obrigatório" },
        { status: 400 }
      );
    }

    const res = await fetch(`${API_URL}/setting/response/category/${responseUuid}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    // Se o status for 204, não há corpo. Retorna a resposta diretamente.
    if (res.status === 204) {
      return NextResponse.json({ success: true, message: "Categoria excluída." });
    }

    // Para outros status (ex: 200, 404, 500), converte o corpo para JSON.
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);
    return NextResponse.json(
      { detail: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}