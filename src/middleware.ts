import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Se é a rota de login e não está logado, permite acesso
  if (request.nextUrl.pathname.startsWith("/login") && !accessToken) {
    return NextResponse.next();
  }

  // Se não tem token de acesso MAS tem refresh token, permite que a página carregue
  // para que o JavaScript(front) possa fazer o refresh
  if (!accessToken && refreshToken) {
    const response = NextResponse.next();
    // Adiciona header para indicar que precisa fazer refresh
    response.headers.set("X-Need-Token-Refresh", "true");
    return response;
  }

  // Se não tem nenhum token, redireciona para login
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // // Se tem token e está tentando acessar login, redireciona para CRM
  // if ((accessToken || refreshToken) && request.nextUrl.pathname.startsWith('/login')) {
  //   return NextResponse.redirect(new URL('/crm', request.url));
  // }

  // Se tem token mas não está no CRM, redireciona para CRM
  if (
    (accessToken || refreshToken) &&
    !request.nextUrl.pathname.startsWith("/crm")
  ) {
    return NextResponse.redirect(new URL("/crm", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
