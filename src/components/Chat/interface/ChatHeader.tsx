"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SearchMessagesModal from "../../modal/Service/SearchMessages";
import {
  CircleCheck,
  ExternalLink,
  Search,
  Play,
  CircleOff,
} from "lucide-react";
import { ContactType } from "@/types/chat";

interface ChatHeaderProps {
  contact: ContactType;
  currentService: any;
  onOpenDismissModal: () => void;
  onOpenFinalizeModal: () => void;
  onOpenTransferModal: () => void;
  onInitiateService: () => void;
  wsStatus: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  contact,
  currentService,
  onOpenDismissModal,
  onOpenFinalizeModal,
  onOpenTransferModal,
  onInitiateService,
  wsStatus,
}) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const isServicePending = currentService?.status === "pending";
  const isServiceInProgress = currentService?.status === "in_progress";
  const isGroup: boolean = contact?.phone_number?.endsWith("@g.us") ?? false;


  const handleOpenSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  return (
    <>
      <div className="flex-shrink-0 border-b border-border bg-card/80 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={contact.photo || "?"} alt={contact.name} />
                <AvatarFallback className="bg-primary text-white">
                  {contact.name.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{contact.name}</h3>
              {/* <p className="text-sm text-foreground/50">{wsStatus}</p> */}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <div className="flex items-center space-x-2">
                {isServicePending && !isGroup && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onInitiateService}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Iniciar Atendimento</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {isServicePending && !isGroup && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={onOpenDismissModal}
                        >
                          <CircleOff className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Desconsiderar Conversa</p>
                      </TooltipContent>
                    </Tooltip>
                  </>
                )}
                {isServiceInProgress && !isGroup && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={onOpenFinalizeModal}
                        >
                          <CircleCheck className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Finalizar Atendimento</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={onOpenTransferModal}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Transferir Atendimento</p>
                      </TooltipContent>
                    </Tooltip>
                  </>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleOpenSearchModal}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Buscar mensagens</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <SearchMessagesModal
        open={isSearchModalOpen}
        onClose={handleCloseSearchModal}
        contactId={contact.phone_number}
        contactPhoneNumber={contact.phone_number}
        contactName={contact.name}
        contactPhoto={contact.photo}
      />
    </>
  );
};

export default ChatHeader;
