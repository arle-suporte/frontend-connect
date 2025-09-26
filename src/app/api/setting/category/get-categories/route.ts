import { NextResponse } from "next/server";
import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function GET() {
  const { access, error } = await checkAuth();
  if (error) return error;

  try {
    const res = await fetch(`${API_URL}/setting/response/category/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return NextResponse.json(
      { detail: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}