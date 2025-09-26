import { checkAuth } from "@/utils/checkAuth";
import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/constants";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ chat_id: string }> }
) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const { chat_id } = await context.params;

  if (!chat_id) {
    return NextResponse.json(
      { detail: "É preciso informar um chat_id." },
      {
        status: 400,
      }
    );
  }

  try {
    const res = await fetch(`${API_URL}/service/?chat_id=${chat_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return new Response(
        JSON.stringify({
          detail: errorData.detail || "Erro ao carregar atendimentos",
        }),
        {
          status: res.status,
        }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Erro", error);
    return NextResponse.json(
      { detail: "Internal Server Error" },
      {
        status: 500,
      }
    );
  }
}
