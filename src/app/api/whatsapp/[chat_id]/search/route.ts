import { checkAuth } from "@/utils/checkAuth";
import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/constants";
import { Message } from "@/types/chat";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ chat_id: string }> }
) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const { chat_id } = await context.params;
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!chat_id) {
    return NextResponse.json(
      {
        detail: "É preciso informar um chat_id.",
      },
      { status: 400 }
    );
  }

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      {
        detail: "É preciso informar um termo de pesquisa.",
      },
      { status: 400 }
    );
  }

  try {
    // Usa a ViewSet existente com parâmetros de pesquisa
    const searchUrl = new URL(`${API_URL}/service/`);
    searchUrl.searchParams.set("chat_id", chat_id);
    searchUrl.searchParams.set("search", query); // Usa o parâmetro 'search' do DRF

    const res = await fetch(searchUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return new Response(
        JSON.stringify({
          detail: errorData.detail || "Erro ao pesquisar mensagens",
        }),
        {
          status: res.status,
        }
      );
    }

    const data = await res.json();

    // Processa os resultados para encontrar mensagens que contenham o termo de pesquisa
    const results = [];

    if (data.results) {
      for (const service of data.results) {
        if (service.messages && Array.isArray(service.messages)) {
          // Procura mensagens que contenham o termo de pesquisa
          const matchingMessages = service.messages.filter(
            (message: Message) =>
              message.text &&
              message.text.toLowerCase().includes(query.toLowerCase())
          );

          for (const message of matchingMessages) {
            results.push({
              service: {
                uuid: service.uuid,
                status: service.status,
                created_at: service.created_at || service.started_at,
                user: service.user,
              },
              message: message,
            });
          }
        }
      }
    }

    return NextResponse.json(
      {
        ...data,
        results: results,
        message_count: results.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro na pesquisa:", error);
    return NextResponse.json(
      {
        detail: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
