import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ uuid: string }> }
) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const { uuid } = await context.params;

  try {
    const res = await fetch(`${API_URL}/contact/${uuid}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    // Verifica PRIMEIRO se a resposta é ok
    if (!res.ok) {
      let errorDetail = "Erro ao buscar contato";

      try {
        const errorData = await res.json();
        errorDetail = errorData.error?.detail || errorDetail;
      } catch {
        // Se não conseguir fazer parse do JSON de erro, usa mensagem padrão
        console.log("Erro ao fazer parse do JSON de erro");
      }

      return new Response(
        JSON.stringify({
          detail: errorDetail,
        }),
        {
          status: res.status,
        }
      );
    }

    // Só faz parse do JSON se a resposta for bem-sucedida
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    console.error("Erro ao encontrar contato:", error);
    return NextResponse.json(
      { detail: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}