export function createWebSocket(
  url: string,
  onMessage: (data: any) => void,
  setStatus?: (
    status: "connecting..." | "connection open" | "connection closed"
  ) => void,
  onReconnect?: () => void,
  reconnectInterval = 2000,
  reconnectOnClose = false
) {
  let ws: WebSocket | null = null;
  let reconnectTimeout: NodeJS.Timeout;

  const connect = () => {
    setStatus?.("connecting...");
    ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WS conectado:", url);
      setStatus?.("connection open");
    };

    ws.onclose = (e) => {
      console.log(`WS desconectado: (code=${e.code}, reason=${e.reason})`, url);
      setStatus?.("connection closed");

      // reconectar também no close se configurado
      if (reconnectOnClose) {
        reconnectTimeout = setTimeout(() => {
          console.log("Tentando reconectar após onclose...");
          if (onReconnect) {
            onReconnect();
          } else {
            connect();
          }
        }, reconnectInterval);
      }
    };

    ws.onerror = (err) => {
      console.error("WS erro:", err);
      reconnectTimeout = setTimeout(() => {
        console.log("Tentando reconectar após onerror...");
        if (onReconnect) {
          onReconnect();
        } else {
          connect();
        }
      }, reconnectInterval);
    };

    ws.onmessage = (event) => {
      try {
        const raw = JSON.parse(event.data);
        onMessage(raw);
      } catch (err) {
        console.error("Erro ao parsear WS:", err);
      }
    };
  };

  connect();

  return () => {
    clearTimeout(reconnectTimeout);
    ws?.close();
  };
}
