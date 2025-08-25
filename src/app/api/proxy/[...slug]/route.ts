import { checkAuth } from "@/utils/checkAuth";
import { NextRequest, NextResponse } from "next/server";
import { API_IP } from "@/lib/constants";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const { slug } = await context.params;
  const mediaPath = slug.join("/");
  const backendUrl = `${API_IP}/${mediaPath}`;

  const res = await fetch(backendUrl, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  if (!res.ok) {
    return new NextResponse("Erro ao buscar mídia", { status: res.status });
  }

  const contentType =
    res.headers.get("content-type") || "application/octet-stream";
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": "inline",
    },
  });
}