"use client";

export async function fetchAccessToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/access", {
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.access ?? null;
  } catch (err) {
    console.error("Erro ao buscar token:", err);
    return null;
  }
}
