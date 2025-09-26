import { authenticatedFetch } from "@/lib/api-client";

export interface SessionData {
  status: string;
  me?: {
    id: string;
  };
  qrCode: any;
  sessionState: any;
}

export type SessionState =
  | "loading"
  | "error"
  | "none"
  | "starting"
  | "working"
  | "qr";

interface FetchSessionResult {
  success: boolean;
  data?: SessionData;
  error?: string;
  sessionState: SessionState;
}

export async function fetchSessionStatus(): Promise<FetchSessionResult> {
  try {
    const response = await authenticatedFetch("/whatsapp/session/session-status");
    if (!response.ok) throw new Error("Falha ao buscar status da sessão");

    const data: SessionData = await response.json();
    console.log(data.status);

    let sessionState: SessionState;
    switch (data.status) {
      case "STARTING":
        sessionState = "starting";
        break;
      case "WORKING":
        sessionState = "working";
        break;
      case "SCAN_QR_CODE":
        sessionState = "qr";
        break;
      default:
        sessionState = "none";
    }

    return {
      success: true,
      data,
      sessionState
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
      sessionState: "error"
    };
  }
}