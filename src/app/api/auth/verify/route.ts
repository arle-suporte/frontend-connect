import { checkAuth } from "@/utils/checkAuth";
import { NextResponse } from "next/server";

export async function GET() {
  const { access, error } = await checkAuth();

  if (error) {
    return error;
  }

  return NextResponse.json({
    message: "Token válido",
    authenticated: true
  });
}