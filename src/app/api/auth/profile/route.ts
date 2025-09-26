import { checkAuth } from "@/utils/checkAuth";
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/constants";

export async function PUT(req: Request) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const formData = await req.formData();

  const res = await fetch(`${API_URL}/authentication/me/update/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${access}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return NextResponse.json(errorData, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: 200 });
}
