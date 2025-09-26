import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/constants";

export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(`${API_URL}/authentication/token/`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorData = await res.json();
    return new Response(
      JSON.stringify({
        detail: errorData.error.detail || "E-mail ou senha incorretos",
      }),
      {
        status: res.status,
      }
    );
  }
  const { access, refresh } = await res.json();

  const cookieStore = cookies();
  const expiresInSeconds = 60 * 60;

  (await cookieStore).set("accessToken", access, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: expiresInSeconds,
  });

  (await cookieStore).set("refreshToken", refresh, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 dias
  });

  return Response.json({ success: true });
}
