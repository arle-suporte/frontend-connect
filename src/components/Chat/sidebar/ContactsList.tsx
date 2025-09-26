import React from "react";
import { ContactType } from "@/types/chat";
import { ContactItem } from "./ContactItem";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { EmptyState } from "../../ui/EmptyState";
import { Button } from "@/components/ui/button";

interface ContactsListProps {
  contacts?: ContactType[];
  groups?: ContactType[];
  selectedContact: ContactType | null;
  isCollapsed: boolean;
  onSelectContact: (contact: ContactType) => void;
  loadingContacts: boolean;
  contactsError: string | null;
  hasNext: boolean;
  loadMore: () => void;
  isDisabled: boolean;
  activeTab: string;
}

export const ContactsList: React.FC<ContactsListProps> = ({
  contacts,
  groups,
  selectedContact,
  isCollapsed,
  onSelectContact,
  loadingContacts,
  contactsError,
  hasNext,
  loadMore,
  isDisabled,
  activeTab,
}) => {
  const itemsToRender = activeTab === "groups" ? groups : contacts;

  if (loadingContacts && itemsToRender?.length === 0) {
    return <LoadingSpinner />;
  }

  if (contactsError) {
    return <ErrorMessage message={contactsError} />;
  }

  if (!itemsToRender?.length) {
    const message =
      activeTab === "groups" ? "Nenhum grupo encontrado." : "Nenhum contato encontrado.";
    return <EmptyState message={message} />;
  }

  return (
    <>
      <div className="space-y-1">
        {itemsToRender.map((contact) => (
          <ContactItem
            key={contact.uuid ?? contact.phone_number}
            contact={contact}
            isActive={selectedContact?.uuid === contact.uuid}
            isCollapsed={isCollapsed}
            onClick={() => onSelectContact(contact)}
            isDisabled={isDisabled}
          />
        ))}
      </div>

      {hasNext && (
        <div className="flex justify-center py-4">
          {loadingContacts ? (
            <LoadingSpinner size="sm" text="Carregando..." />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={loadMore}
              className="text-sm"
            >
              Carregar mais
            </Button>
          )}
        </div>
      )}
    </>
  );
};
