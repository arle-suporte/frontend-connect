// TabContent.tsx
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServiceType, ContactType } from "@/types/chat";
import { ServicesList } from "../ServicesList";
import { ContactsList } from "../ContactsList";

interface TabContentProps {
  value: string;
  services?: ServiceType[];
  contacts?: ContactType[];
  groups?: ContactType[];
  selectedContact: ContactType | null;
  isCollapsed: boolean;
  onSelectContact: (contact: ContactType) => void;
  loadingServices?: boolean;
  servicesError?: string | null;
  loadingContacts?: boolean;
  contactsError?: string | null;
  hasNext?: boolean;
  loadMore?: () => void;
  isDisabled: boolean;
  activeTab: string;
}

export const TabContent: React.FC<TabContentProps> = ({
  value,
  services,
  contacts,
  groups,
  selectedContact,
  isCollapsed,
  onSelectContact,
  loadingServices,
  servicesError,
  loadingContacts,
  contactsError,
  hasNext,
  loadMore,
  isDisabled,
  activeTab,
}) => {
  const isContactsTab = value === 'contacts' || value === 'groups';

  return (
    <TabsContent value={value} className="h-full m-0">
      <ScrollArea className="h-full">
        <div className="p-2 space-y-1">
          {isContactsTab ? (
            <ContactsList
              contacts={contacts}
              groups={groups}
              selectedContact={selectedContact}
              isCollapsed={isCollapsed}
              onSelectContact={onSelectContact}
              loadingContacts={loadingContacts || false}
              contactsError={contactsError || null}
              hasNext={hasNext || false}
              loadMore={loadMore || (() => {})}
              isDisabled={isDisabled}
              activeTab={activeTab}
            />
          ) : (
            <ServicesList
              services={services}
              selectedContact={selectedContact}
              isCollapsed={isCollapsed}
              onSelectContact={onSelectContact}
              loadingServices={loadingServices || false}
              servicesError={servicesError || null}
              isDisabled={isDisabled}
            />
          )}
        </div>
      </ScrollArea>
    </TabsContent>
  );
};