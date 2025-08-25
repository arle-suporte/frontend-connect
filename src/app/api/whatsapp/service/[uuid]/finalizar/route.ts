import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function POST(
  request: NextRequest,
  { params }: { params: { uuid: string } }
) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const { uuid } = await params;

  try {
    const res = await fetch(`${API_URL}/service/${uuid}/finalizar/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro ao finalizar atendimento:", error);
    return NextResponse.json(
      { detail: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
