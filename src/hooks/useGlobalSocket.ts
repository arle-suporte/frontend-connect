"use client";

import { useEffect, useState } from "react";
import { createWebSocket } from "@/utils/websocket/ws-client";
import { fetchAccessToken } from "@/lib/auth-tokens";
import { WS_URL_CHAT } from "@/lib/constants";

export function useGlobalSocket() {
  const [events, setEvents] = useState<any[]>([]);
  const [status, setStatus] = useState<
    "connecting..." | "connection open" | "connection closed"
  >("connection closed");

  useEffect(() => {
    let disconnect: (() => void) | undefined;

    const init = async () => {
      const accessToken = await fetchAccessToken();
      if (!accessToken) {
        console.warn("Não foi possível obter accessToken para WS global.");
        return;
      }

      const baseUrl = WS_URL_CHAT
      const wsUrl = `${baseUrl}/global/?token=${accessToken}`;

      disconnect = createWebSocket(
        wsUrl,
        (raw) => {
          if (raw) {
            setEvents((prev) => [...prev, raw]); // Armazena o objeto completo
          }
        },
        setStatus,
        undefined,
        2000,
        true // reconectar no close
      );
    };

    init();

    return () => {
      if (disconnect) disconnect();
    };
  }, []);

  return { events, status, setEvents };
}