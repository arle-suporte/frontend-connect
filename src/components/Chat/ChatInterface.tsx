"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import ChatHeader from "./interface/ChatHeader";
import ChatMessages from "./interface/ChatMessages";
import ChatInput from "./interface/ChatInput";
import FinalizeServiceModal from "../modal/Service/FinalizeService";
import DismissServiceModal from "../modal/Service/DismissService";
import TransferServiceModal from "../modal/Service/TransferService";
import { ContactType } from "@/types/chat";
import { initiateService } from "@/services/service/initiate-service";
import { useChatSocket } from "@/hooks/useChatSocket";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ChatInterfaceProps {
  accessToken: string | null;
  contact: ContactType;
  services: any;
  onSendMessage: (content: string) => void;
  onSendFileMessage: (file: File) => void;
  onSendMediaMessage: (file: File) => void;
  onSendAudioMessage: (file: File) => void;
  loadMore?: () => void;
  hasMore?: boolean;
  shouldScrollToBottom?: boolean;
  onScrollComplete?: () => void;
  loadingServices: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  contact,
  services,
  onSendMessage,
  onSendMediaMessage,
  onSendFileMessage,
  onSendAudioMessage,
  loadMore,
  hasMore,
  shouldScrollToBottom,
  onScrollComplete,
  loadingServices,
}) => {
  const {
    messages: realtimeMessages,
    currentService: wsCurrentService,
    allServices: wsAllServices,
    blockedUsers,
    wsAvailability,
    blockedServiceIds,
    status,
  } = useChatSocket(contact?.phone_number ?? null);

  const [newMessage, setNewMessage] = useState<string>("");
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDismissModal, setShowDismissModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const organizedServices = useMemo(() => {
    const serviceMap = new Map();

    services?.results?.forEach((service: any) => {
      if (blockedServiceIds.has(service.uuid)) return;
      serviceMap.set(service.uuid, {
        ...service,
        messages: service.messages || [],
      });
    });

    wsAllServices?.forEach((wsService: any) => {
      const uuid = wsService.uuid || wsService.service_id;
      if (uuid) {
        if (blockedServiceIds.has(uuid)) return;
        const existingService = serviceMap.get(uuid);
        if (existingService) {
          serviceMap.set(uuid, { ...existingService, ...wsService });
        } else if (wsService.contact_id === contact?.phone_number) {
          serviceMap.set(uuid, { ...wsService, messages: [] });
        }
      }
    });

    realtimeMessages.forEach((msg) => {
      const targetServiceId = msg.service_id;
      if (!targetServiceId) return;
      if (blockedServiceIds.has(targetServiceId)) return;
      const targetService = serviceMap.get(targetServiceId);
      if (targetService) {
        if (!targetService.messages.some((m: any) => m.id === msg.id)) {
          targetService.messages = [...targetService.messages, msg];
        }
      }
    });

    return Array.from(serviceMap.values()).sort(
      (a: any, b: any) =>
        new Date(a.created_at || a.started_at || 0).getTime() -
        new Date(b.created_at || b.started_at || 0).getTime()
    );
  }, [
    services?.results,
    realtimeMessages,
    wsAllServices,
    contact?.phone_number,
    wsCurrentService,
    blockedServiceIds,
  ]);

  const currentService = useMemo(() => {
    if (wsCurrentService) {
      return {
        ...wsCurrentService,
        uuid: wsCurrentService.uuid || wsCurrentService.service_id,
        service_id: wsCurrentService.service_id || wsCurrentService.uuid,
      };
    }
    return (
      organizedServices.find((s) =>
        ["pending", "in_progress"].includes(s.status)
      ) || null
    );
  }, [wsCurrentService, organizedServices]);

  const handleSendMessage = useCallback(() => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  }, [newMessage, onSendMessage]);

  const handleInitiateService = useCallback(async () => {
    try {
      await initiateService(currentService, contact);
    } catch (error) {
      toast.error("Erro ao iniciar serviço");
    }
  }, [currentService, contact]);

  const serviceUuid =
    currentService?.uuid || currentService?.service_id || null;

  const wsAvail = wsAvailability.get(contact?.phone_number);

  const activeServiceUser = useMemo(() => {
    if (wsAvail === "locked") {
      return (
        wsCurrentService?.user_name ||
        blockedUsers.get(contact?.phone_number) ||
        "unknown"
      );
    }
    if (wsAvail === "unlocked") {
      return null;
    }
    return contact.active_service_user || null;
  }, [
    wsAvail,
    wsCurrentService?.user_name,
    blockedUsers,
    contact?.phone_number,
    contact?.active_service_user,
  ]);

  useEffect(() => {
    if (shouldScrollToBottom && organizedServices.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
      onScrollComplete?.();
    }
  }, [shouldScrollToBottom, organizedServices, onScrollComplete]);

  if (loadingServices) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-foreground">Carregando atendimentos...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-[calc(100vh-60px-48px)] overflow-hidden bg-background">
      <ChatHeader
        contact={contact}
        currentService={currentService}
        onOpenDismissModal={() => setShowDismissModal(true)}
        onOpenFinalizeModal={() => setShowFinalizeModal(true)}
        onOpenTransferModal={() => setShowTransferModal(true)}
        onInitiateService={handleInitiateService}
        wsStatus={status}
      />
      <ChatMessages
        organizedServices={organizedServices}
        messagesEndRef={messagesEndRef}
        contact={contact}
        currentService={currentService}
        hasMore={hasMore}
        loadMore={loadMore}
      />
      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
        onSendFileMessage={onSendFileMessage}
        onSendMediaMessage={onSendMediaMessage}
        onSendAudioMessage={onSendAudioMessage}
        wsStatus={status}
        contact={contact}
        activeServiceUser={activeServiceUser}
      />
      <FinalizeServiceModal
        open={showFinalizeModal}
        onClose={() => setShowFinalizeModal(false)}
        serviceUuid={serviceUuid || ""}
        contactName={contact.name}
      />
      <DismissServiceModal
        open={showDismissModal}
        onClose={() => setShowDismissModal(false)}
        serviceUuid={serviceUuid || ""}
        contactName={contact.name}
      />
      <TransferServiceModal
        open={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        serviceUuid={serviceUuid || ""}
        contactName={contact.name}
        collaborators={currentService?.collaborators || []}
        onConfirm={() => setShowTransferModal(false)}
      />
    </div>
  );
};

export default ChatInterface;
