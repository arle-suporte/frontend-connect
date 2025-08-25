'use client';
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { ContactType } from "@/types/chat";
import { getStatusBorderColor, getStatusTitle, getStatusBgColor } from "@/utils/status";
import { formatDate, formatTime } from "@/utils/time";
import { cn } from "@/lib/utils";

interface SessionHeaderProps {
  service: any;
}

interface ChatMessagesProps {
  organizedServices: any[];
  messagesEndRef: any
  contact: ContactType;
}


const SessionHeader: React.FC<SessionHeaderProps> = ({ service }) => {

  const shouldShowTimeline = ['in_progress', 'finalized', 'dismiss', 'transferred'].includes(service.status);

  return (
    <div className="flex items-center mb-4 pl-0 relative">
      {shouldShowTimeline && (
        <div className={cn(
          "absolute -left-7 bottom-8 w-3 h-3 rounded-full border-2 bg-background z-10",
          getStatusBorderColor(service.status)
        )}></div>
      )}
      <div className="flex-1">
        <div className={cn("text-sm font-medium", getStatusBorderColor(service.status))}>
          {getStatusTitle(service.status)}
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          • Iniciado em {formatDate(service.created_at)} - {formatTime(service.created_at)} por {service.user}
        </div>
      </div>
    </div>
  );
};


const ChatMessages: React.FC<ChatMessagesProps> = ({ organizedServices, messagesEndRef, contact }) => {
  return (
    <div className="flex-1 min-h-0">
      <ScrollArea className="h-full">
        <div className="py-4 space-y-8 px-4">
          {organizedServices.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm">
              Nenhum atendimento para este contato.
            </p>
          ) : (
            <div className="relative">
              {organizedServices.map((service, serviceIndex) => {
                const shouldShowTimeline = ['in_progress', 'finalized', 'dismiss', 'transferred'].includes(service.status);
                return (
                  <div key={service.uuid} className="relative mb-8">
                    {shouldShowTimeline && (
                      <>
                        <div
                          className={cn(
                            "absolute left-2 top-0 w-0.5 z-0",
                            getStatusBgColor(service.status)
                          )}
                          style={{ height: `calc(100% - 32px)` }}
                        ></div>
                        <div className={cn(
                          "absolute left-1 w-3 h-3 rounded-full border-2 bg-background z-10",
                          getStatusBorderColor(service.status)
                        )}
                          style={{ top: `calc(100% - 40px)` }}
                        ></div>
                      </>
                    )}
                    <div className={cn(shouldShowTimeline ? "ml-8" : "ml-0", "space-y-4 pb-8")}>
                      {shouldShowTimeline && <SessionHeader service={service} />}
                      {service.messages.map((message: any) => (
                        <MessageBubble
                          key={message.message_id}
                          message={message}
                          contactName={contact.name}
                          contactPicture={contact.photo}
                          service={service}
                        />
                      ))}
                      <div className="text-xs text-muted-foreground mt-6 font-medium">
                        {service.finished_at && (
                          <> • {getStatusTitle(service.status)} {formatDate(service.finished_at)} - {formatTime(service.finished_at)} por {service.user} </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatMessages;