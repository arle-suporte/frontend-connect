"use client";
import React from "react";

import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { ContactType } from "@/types/chat";

import {
  getStatusBorderColor,
  getStatusTitle,
  getStatusBgColor,
} from "@/utils/status";

import { formatDate, formatTime } from "@/utils/time";
import { cn } from "@/lib/utils";

interface SessionHeaderProps {
  service: any;
  isCurrentService?: boolean;
}

interface ChatMessagesProps {
  organizedServices: any[];
  messagesEndRef: any;
  contact: ContactType;
  currentService?: any;
  hasMore?: boolean;
  loadMore?: () => void;
}

const SessionHeader: React.FC<SessionHeaderProps> = ({ service, isCurrentService }) => {
  const shouldShowTimeline = [
    "in_progress",
    "finalized",
    "dismiss",
    "transferred",
  ].includes(service.status);

  // Use status em tempo real se for o serviço atual
  const displayService = service;

  return (
    <div className="flex items-center mb-4 pl-0 relative">
      {shouldShowTimeline && (
        <div
          className={cn(
            "absolute -left-7 bottom-8 w-3 h-3 rounded-full border-2 bg-background z-10",
            getStatusBorderColor(displayService.status)
          )}
        ></div>
      )}
      <div className="flex-1">
        <div
          className={cn(
            "text-sm font-medium",
            getStatusBorderColor(displayService.status)
          )}
        >
          {getStatusTitle(displayService.status)}
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          • Iniciado em {formatDate(displayService.created_at || displayService.started_at)} -{" "}
          {formatTime(displayService.created_at || displayService.started_at)} por{" "}
          {displayService.user || displayService.user_name}
        </div>
      </div>
    </div>
  );
};

const ChatMessages: React.FC<ChatMessagesProps> = ({
  organizedServices,
  messagesEndRef,
  contact,
  currentService,
  hasMore,
  loadMore
}) => {
  return (
    <div className="flex-1 min-h-0">
      <ScrollArea className="h-full">

        {hasMore && (
          <div className="text-center p-2">
            <Button onClick={loadMore} variant={'ghost'} disabled={!loadMore}>
              Carregar mais
            </Button>
          </div>
        )}

        <div className="py-4 space-y-8 px-4">
          {organizedServices.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm">
              Nenhum atendimento para este contato.
            </p>
          ) : (
            <div className="relative">
              {organizedServices.map((service, serviceIndex) => {
                // Verificar se é o serviço atual
                const isCurrentService = currentService &&
                  (service.uuid === currentService.uuid ||
                    service.uuid === currentService.service_id ||
                    service.service_id === currentService.uuid);

                const displayService = service;

                const shouldShowTimeline = [
                  "in_progress",
                  "finalized",
                  "dismiss",
                  "transferred",
                ].includes(displayService.status);

                // Garantir que o service.uuid existe, senão usar o índice como fallback
                const serviceKey = service.uuid || service.service_id || `service-${serviceIndex}`;

                // ORDENAR MENSAGENS POR TIMESTAMP
                const sortedMessages = service.messages
                  ? [...service.messages].sort((a, b) => {
                    const timeA = new Date(a.timestamp || a.created_at || 0).getTime();
                    const timeB = new Date(b.timestamp || b.created_at || 0).getTime();
                    return timeA - timeB; // Ordem crescente (mais antigas primeiro)
                  })
                  : [];

                return (
                  <div key={serviceKey} className="relative mb-8">
                    {shouldShowTimeline && (
                      <>
                        <div
                          className={cn(
                            "absolute left-2 top-0 w-0.5 z-0",
                            getStatusBgColor(displayService.status)
                          )}
                          style={{ height: `calc(100% - 32px)` }}
                        ></div>
                        <div
                          className={cn(
                            "absolute left-1 w-3 h-3 rounded-full border-2 bg-background z-10",
                            getStatusBorderColor(displayService.status)
                          )}
                          style={{ top: `calc(100% - 40px)` }}
                        ></div>
                      </>
                    )}
                    <div
                      className={cn(
                        shouldShowTimeline ? "ml-8" : "ml-0",
                        "space-y-4 pb-8"
                      )}
                    >
                      {shouldShowTimeline && (
                        <SessionHeader
                          service={displayService}
                          isCurrentService={isCurrentService}
                        />
                      )}
                      {sortedMessages.map((message: any, messageIndex: number) => {
                        // Criar uma chave única garantida para cada mensagem
                        const messageKey = message.message_id ||
                          message.id ||
                          `${serviceKey}-msg-${messageIndex}`;

                        return (
                          <MessageBubble
                            key={messageKey}
                            message={message}
                            contactName={contact.name}
                            contactPicture={contact.photo}
                            service={displayService}
                          />
                        );
                      })}
                      <div className="text-xs text-muted-foreground mt-6 font-medium">
                        {displayService.finished_at && (
                          <>
                            {" "}
                            • {getStatusTitle(displayService.status)}{" "}
                            {formatDate(displayService.finished_at)} -{" "}
                            {formatTime(displayService.finished_at)} por{" "}
                            {displayService.user || displayService.user_name}{" "}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>
    </div>
  );
};

export default ChatMessages;