"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleCheck, Wrench, Loader2 } from "lucide-react";
import QRCode from "react-qr-code";
import { fetchSessionStatus, SessionData, SessionState } from "@/services/setting/session/get-session-status";
import { removeSession } from "@/services/setting/session/remove-session";
import { createSession } from "@/services/setting/session/create-session";

interface SessionConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSessionConfigured: () => void;
}

export default function SessionConfigModal({ open, onOpenChange, onSessionConfigured }: SessionConfigModalProps) {
  const [sessionStatus, setSessionStatus] = useState<SessionData | null>(null);
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [state, setState] = useState<SessionState>("loading");
  const [error, setError] = useState<string | null>(null);

  // Função para buscar o status da sessão e atualizar o estado do componente
  async function updateSessionStatus() {
    const result = await fetchSessionStatus();
    if (result.success) {
      setSessionStatus(result.data || null);
      setState(result.sessionState);

      if (result.sessionState === "qr" && result.data?.qrCode) {
        setQrCodeValue(result.data.qrCode);
      }

      // Chamada do callback quando a sessão estiver "WORKING"
      if (result.sessionState === "working") {
        onSessionConfigured();
      }

    } else {
      setError(result.error || "Falha ao buscar status da sessão");
      setState("error");
    }
  }

  // Efeito para buscar o status inicial da sessão quando o modal é aberto
  useEffect(() => {
    if (!open) return;
    updateSessionStatus();
  }, [open]);

  // Efeito para fazer o polling (verificação periódica) do status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state === "qr" || state === "starting") {
      interval = setInterval(() => {
        updateSessionStatus();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state]);


  const handleRemoveSession = async () => {
    setState("loading");
    setError(null);
    setQrCodeValue(null);
    setSessionStatus(null);

    const result = await removeSession();

    if (result.success) {
      setState("none");
      onSessionConfigured();
    } else {
      setError(result.error || "Erro ao remover sessão");
      setState("error");
    }
  };

  const handleCreateSession = async () => {
    setState("loading");
    setError(null);

    const result = await createSession();

    if (result.success) {
      const data = result.data;
      if (data?.value) {
        setQrCodeValue(data.value);
        setState("qr");
      } else {
        setSessionStatus(data || null);
        setState(data?.status === "WORKING" ? "working" : "starting");
      }
    } else {
      setError(result.error || "Erro desconhecido");
      setState("error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configuração do celular</DialogTitle>
        </DialogHeader>

        {(state === "loading" || state === "starting") && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {state === "error" && (
          <div className="text-center space-y-4">
            <Wrench className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Erro: {error}</p>
            <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
          </div>
        )}

        {state === "qr" && qrCodeValue && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Escaneie o QR Code</h3>
            <p className="text-sm text-muted-foreground">
              Abra o WhatsApp no celular → Aparelhos conectados → Escaneie o código.
            </p>
            <div className="flex justify-center p-4">
              <QRCode value={qrCodeValue} size={256} />
            </div>
            <h3 className="text-foreground">
              Se você já escaneou, aguarde mais alguns instantes para sincronização.
              Não recarregue a página.
            </h3>
          </div>
        )}

        {state === "working" && sessionStatus?.me && (
          <div className="flex flex-col items-center text-center space-y-6">
            <p className="text-xl font-semibold text-foreground">
              {`+${sessionStatus.me.id.split("@")[0].slice(0, 2)} ${sessionStatus.me.id.split("@")[0].slice(2, 4)} ${sessionStatus.me.id.split("@")[0].slice(4, 8)}-${sessionStatus.me.id.split("@")[0].slice(8, 12)}`}
            </p>
            <CircleCheck className="h-24 w-24 text-primary" />
            <p className="text-md text-foreground">
              Seu número está sincronizado e funcionando corretamente.
            </p>
            <div className="grid w-full gap-2 pt-4">
              <Button variant="ghost" className="w-full" onClick={handleRemoveSession}>
                Remover número
              </Button>
            </div>
          </div>
        )}

        {state === "none" && (
          <div className="text-center space-y-4">
            <p className="text-lg">Sessão não encontrada. Crie uma nova.</p>
            <Button onClick={handleCreateSession}>Criar nova sessão</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}