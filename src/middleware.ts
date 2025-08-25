import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {

  // Para todas as outras rotas, verifica autenticação
  const access = (await cookies()).get('accessToken')?.value;

  // Se é a rota de login e não está logado, permite acesso
  if (request.nextUrl.pathname.startsWith('/login') && !access) {
    return NextResponse.next()
  }

  // Se não tem token, redireciona para login
  if (!access) {
    return NextResponse.redirect(new URL('/login', request.url))

  } else if (access && !request.nextUrl.pathname.startsWith('/crm')) {
    return NextResponse.redirect(new URL('/crm', request.url))
  }

  // Token existe, permite acesso
  return NextResponse.next()
}

// Executa para todas as rotas exceto arquivos estáticos e API do Next.js
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}