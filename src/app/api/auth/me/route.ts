import { checkAuth } from "@/utils/checkAuth";
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/constants";

export async function GET() {
  const { access, error } = await checkAuth();
  if (error) return error;

  const res = await fetch(`${API_URL}/authentication/me/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    return NextResponse.json(errorData, { status: res.status });
  }

  const data = await res.json();
  // console.log(data);
  return Response.json(data);
}
