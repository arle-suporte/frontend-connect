import React, { useMemo, useCallback } from "react";
import { ServiceType, ContactType } from "@/types/chat";
import { ContactItem } from "./ContactItem";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { EmptyState } from "../../ui/EmptyState";

interface ServicesListProps {
  services: ServiceType[] | undefined;
  selectedContact: ContactType | null;
  isCollapsed: boolean;
  onSelectContact: (contact: ContactType) => void;
  loadingServices: boolean;
  servicesError: string | null;
  isDisabled: boolean;
}

export const ServicesList: React.FC<ServicesListProps> = ({
  services,
  selectedContact,
  isCollapsed,
  onSelectContact,
  loadingServices,
  servicesError,
  isDisabled,
}) => {
  const filteredServices = useMemo(() => services, [services]);

    // Função para criar ContactType a partir do ServiceType
    const createContactFromService = useCallback((service: any): any => {
      return {
        uuid: service.contact,
        name: service.contact_name || "Sem nome",
        phone_number: service.chat_id,
        photo: service.contact_photo || "",
        is_group: false,
        is_deleted: false,
      };
    }, []);

  if (loadingServices) {
    return <LoadingSpinner />;
  }

  if (servicesError) {
    return <ErrorMessage message={servicesError} />;
  }

  if (!filteredServices?.length && !isCollapsed) {
    return <EmptyState message="Nenhum atendimento encontrado" />;
  }

  return (
    <div className="space-y-1">
      {filteredServices?.map((service) => {
        const serviceContact = createContactFromService(service);
        const lastMessage = service.messages && service.messages.length > 0
          ? service.messages[service.messages.length - 1]
          : undefined;

        return (
          <ContactItem
            key={service.uuid}
            contact={serviceContact}
            isService
            isActive={selectedContact?.uuid === serviceContact.uuid}
            isCollapsed={isCollapsed}
            onClick={() => onSelectContact(serviceContact)}
            user={service.user}
            unreadMessagesCount={service.unread_messages_count}
            lastMessage={lastMessage}
            isDisabled={isDisabled}
          />
        );
      })}
    </div>
  );
};