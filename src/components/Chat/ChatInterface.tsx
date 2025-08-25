'use client';
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import FinalizeServiceModal from "../modal/Service/FinalizeService";
import DismissServiceModal from "../modal/Service/DismissService";
import { ContactType } from "@/types/chat";
import { initiateService } from "@/services/service/initiate-service";
import TransferServiceModal from "../modal/Service/TransferService";

interface ChatInterfaceProps {
  contact: ContactType;
  services: any;
  onSendMessage: (content: string) => void;
  onSendFileMessage: (file: File) => void;
  onSendMediaMessage: (file: File) => void;
  onSendAudioMessage: (file: File) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  contact,
  services,
  onSendMessage,
  onSendMediaMessage,
  onSendFileMessage,
  onSendAudioMessage,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDismissModal, setShowDismissModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleOpenDismissModal = () => setShowDismissModal(true);
  const handleCloseDismissModal = () => setShowDismissModal(false);
  const handleOpenFinalizeModal = () => setShowFinalizeModal(true);
  const handleCloseFinalizeModal = () => setShowFinalizeModal(false);
  const handleopenTransferModal = () => { setShowTransferModal(true) }

  const organizedServices = useMemo(() => {
    if (!services.results || services.results.length === 0) {
      return [];
    }
    return services.results.map((service: any) => ({
      ...service,
      messages: service.messages || []
    })).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [services.results]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [services, scrollToBottom]);

  const handleSendMessage = useCallback(() => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  }, [newMessage, onSendMessage]);

  const currentService = services.results?.[0] ?? null;
  const serviceUuid = currentService?.uuid ?? null;

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-64px-48px)] overflow-hidden bg-gradient-chat z-1">
      <ChatHeader
        contact={contact}
        currentService={currentService}
        onOpenDismissModal={handleOpenDismissModal}
        onOpenFinalizeModal={handleOpenFinalizeModal}
        onOpenTransferModal={handleopenTransferModal}
        onInitiateService={() => initiateService(currentService, contact)}
      />

      <ChatMessages organizedServices={organizedServices} messagesEndRef={messagesEndRef} contact={contact} />

      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
        onSendFileMessage={onSendFileMessage}
        onSendMediaMessage={onSendMediaMessage}
        onSendAudioMessage={onSendAudioMessage}
      />

      <FinalizeServiceModal
        isOpen={showFinalizeModal}
        onClose={handleCloseFinalizeModal}
        serviceUuid={serviceUuid || ''}
        contactName={contact.name}
      />

      <DismissServiceModal
        isOpen={showDismissModal}
        onClose={handleCloseDismissModal}
        serviceUuid={serviceUuid || ''}
        contactName={contact.name}
      />

      <TransferServiceModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        serviceUuid={serviceUuid || ''}
        contactName={contact.name}
        collaborators={currentService?.collaborators || []}
        onConfirm={(selectedUuid) => {
          setShowTransferModal(false);
        }}
      />
    </div>
  );
};

export default ChatInterface;