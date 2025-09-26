import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServiceType, ContactType } from "@/types/chat";
import { ServicesList } from "./ServicesList";

interface CollapsedSidebarProps {
  services: ServiceType[];
  selectedContact: ContactType | null;
  onSelectContact: (contact: ContactType) => void;
  loadingServices: boolean;
  servicesError: string | null;
  isDisabled: boolean;
}

export const CollapsedSidebar: React.FC<CollapsedSidebarProps> = ({
  services,
  selectedContact,
  onSelectContact,
  loadingServices,
  servicesError,
  isDisabled,
}) => {
  return (
    <div className="flex-1 min-h-0">
      <ScrollArea className="h-full">
        <div className="space-y-2 p-2">
          <ServicesList
            services={services}
            selectedContact={selectedContact}
            isCollapsed={true}
            onSelectContact={onSelectContact}
            loadingServices={loadingServices}
            servicesError={servicesError}
            isDisabled={isDisabled}
          />
        </div>
      </ScrollArea>
    </div>
  );
};