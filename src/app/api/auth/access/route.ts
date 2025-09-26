import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/constants";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (accessToken) {
    return NextResponse.json({ access: accessToken });
  }

  if (refreshToken) {
    const res = await fetch(`${API_URL}/authentication/refresh/`, {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const { access } = await res.json();
      return NextResponse.json({ access });
    }
  }

  return NextResponse.json({ access: null }, { status: 401 });
}
