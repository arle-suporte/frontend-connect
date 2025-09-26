import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CircleUser } from "lucide-react";
import { ContactType, Message } from "@/types/chat";
import { formatTime } from "@/utils/time";
import { cn } from "@/lib/utils";

interface ContactItemProps {
  contact: ContactType;
  isService?: boolean;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
  user?: string;
  unreadMessagesCount?: number;
  lastMessage?: Message;
  isDisabled: boolean;
}

export const ContactItem = React.memo<ContactItemProps>(function ContactItem({
  contact,
  isService = false,
  isActive,
  isCollapsed,
  onClick,
  user,
  unreadMessagesCount,
  lastMessage,
  isDisabled,
}) {
  const isDeleted = contact.is_deleted === true;
  const itemIsDisabled = isDeleted || isDisabled;

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full p-3 h-auto justify-start text-left transition-all duration-200 relative",
        isService && "h-20",
        isActive && "bg-primary/10 border-l-2 border-l-primary",
        !isCollapsed && "hover:bg-primary/5 hover:cursor-pointer",
        itemIsDisabled && "pointer-events-none opacity-50"
      )}
      onClick={onClick}
      disabled={itemIsDisabled}
    >
      <div className="flex items-center space-x-3 w-full min-w-0">
        {isService && user && (
          <p className="text-xs text-gray-700 bg-gray-200 rounded-full flex items-center mt-0.5 absolute top-1 right-0 px-1">
            <CircleUser className="h-1 w-1 mr-1" />
            {user}
          </p>
        )}
        
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={contact.photo || "?"} alt={contact.name} />
            <AvatarFallback className="bg-primary text-white text-sm">
              {(contact.name || "?").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">{contact.name}</p>
            </div>
            {isService && lastMessage && (
              <div className="flex items-center justify-between text-xs text-muted-foreground pr-8">
                <span className="truncate">
                  {lastMessage.text?.length > 20
                    ? `${lastMessage.text.slice(0, 20)}...`
                    : lastMessage.text || "Sem mensagem"}
                </span>
                <span className="whitespace-nowrap">
                  {formatTime(lastMessage.timestamp)}
                </span>
              </div>
            )}
          </div>
        )}

        {isService && unreadMessagesCount && (
          <div className="absolute bottom-2 right-2 min-w-[1.2rem] h-5 px-1 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center border-2">
            {unreadMessagesCount}
          </div>
        )}
      </div>
    </Button>
  );
});
