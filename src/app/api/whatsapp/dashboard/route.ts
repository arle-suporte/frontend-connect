import { NextResponse } from "next/server";
import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function GET(request: Request) {
  const { access, error } = await checkAuth();
  if (error) return error;

  try {
    const res = await fetch(`${API_URL}/service/dashboard/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro ao encontrar atendimentos:", error);
    return NextResponse.json(
      { detail: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
