const BASE_API_URL = "/api";
let hasCheckedOnLoad = false;
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

// Fila de requests aguardando refresh
let pendingRequests: Array<{
  path: string;
  options?: RequestInit;
  resolve: (response: Response) => void;
  reject: (error: any) => void;
}> = [];

async function handleTokenRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise; // já está em andamento

  isRefreshing = true;
  refreshPromise = new Promise(async (resolve) => {
    try {
      const refreshRes = await fetch(`${BASE_API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!refreshRes.ok) {
        window.location.href = "/login";
        resolve(false);
        return;
      }

      resolve(true);
    } catch (error) {
      console.error("Erro no refresh:", error);
      window.location.href = "/login";
      resolve(false);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
      await processPendingRequests();
    }
  });

  return refreshPromise;
}

async function processPendingRequests() {
  const requests = [...pendingRequests];
  pendingRequests = [];

  for (const request of requests) {
    try {
      const response = await fetch(
        `${BASE_API_URL}${request.path}`,
        request.options
      );
      request.resolve(response);
    } catch (error) {
      request.reject(error);
    }
  }
}

export async function authenticatedFetch(
  path: string,
  options?: RequestInit
): Promise<Response> {
  // Se está em refresh, aguarda
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      pendingRequests.push({ path, options, resolve, reject });
    });
  }

  let response = await fetch(`${BASE_API_URL}${path}`, options);

  if (response.status === 401 || response.status === 403) {
    const retryRequest = new Promise<Response>((resolve, reject) => {
      pendingRequests.push({ path, options, resolve, reject });
    });

    const refreshSuccess = await handleTokenRefresh();

    if (refreshSuccess) {
      return retryRequest;
    } else {
      throw new Error("Sessão expirada, redirecionando para login.");
    }
  }

  return response;
}

// Verificação inicial no load
async function checkJWTOnRefresh(): Promise<void> {
  if (hasCheckedOnLoad) return;
  hasCheckedOnLoad = true;

  const publicRoutes = ["/login"];
  if (publicRoutes.some((route) => window.location.pathname.includes(route))) {
    return;
  }

  try {
    const response = await fetch(`${BASE_API_URL}/auth/verify`);
    if (response.status === 401) {
      await handleTokenRefresh();
    }
  } catch (error) {
    console.error("Erro na verificação inicial:", error);
  }
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      checkJWTOnRefresh();
    });
  } else {
    setTimeout(() => {
      checkJWTOnRefresh();
    }, 100);
  }
}
