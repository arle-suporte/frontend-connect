const BASE_API_URL = '/api'; 

async function handleTokenRefresh(): Promise<boolean> {
  try {
    const refreshRes = await fetch(`${BASE_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!refreshRes.ok) {
      window.location.href = '/login';
      return false;
    }

    return true;

  } catch (error) {
    window.location.href = '/login';
    return false;
  }
}

export async function authenticatedFetch(path: string, options?: RequestInit): Promise<Response> {
  let response = await fetch(`${BASE_API_URL}${path}`, options);

  if (response.status === 401) {
    console.warn('Token de acesso expirado ou inválido. Tentando dar refresh...');
    const refreshSuccess = await handleTokenRefresh();

    if (refreshSuccess) {
      response = await fetch(`${BASE_API_URL}${path}`, options); // Repete a requisição
    } else {
      return response;
    }
  }

  return response;
}