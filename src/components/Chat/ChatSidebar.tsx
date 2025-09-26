"use client";

import React, { useState, useEffect, useMemo, useCallback, use } from "react";
import { Tabs } from "@/components/ui/tabs";
import { ContactType, ServiceType, Message } from "@/types/chat";
import { useGlobalSocket } from "@/hooks/useGlobalSocket";
import { cn } from "@/lib/utils";
import useDebounce from "@/hooks/use-debounce";
import { authenticatedFetch } from "@/lib/api-client";
import { createServiceFromEvent } from "@/utils/websocket/serialize-service";

// Componentes
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { TabNavigation } from "./sidebar/Tabs/TabNavigation";
import { SearchInput } from "./sidebar/SearchInput";
import { TabContent } from "./sidebar/Tabs/TabContent";
import { CollapsedSidebar } from "./sidebar/CollapsedSidebar";


type ServiceStatus = "in_progress" | "pending";
type ActiveTab = "contacts" | ServiceStatus | "groups";

interface ServicesResponse {
  results: ServiceType[];
}

interface ChatSidebarProps {
  // Props vindas do componente pai
  contacts: ContactType[];
  groups: ContactType[];
  loadingContacts: boolean;
  contactsError: string | null;
  hasNext: boolean;
  loadMore: () => void;
  onSearchContacts: (query: string) => void;
  loadContacts: () => void;
  loadGroups: () => void;

  // Props próprias do sidebar
  selectedContact: ContactType | null;
  onSelectContact: (contact: ContactType) => void;
  isCollapsed: boolean;
  onToggle: () => void;
  isDisabled: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  // Props dos contatos do pai
  contacts,
  groups,
  loadingContacts,
  contactsError,
  hasNext,
  loadMore,
  onSearchContacts,
  loadContacts,
  loadGroups,

  // Props próprias
  selectedContact,
  onSelectContact,
  isCollapsed,
  onToggle,
  isDisabled,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("in_progress");
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [lastProcessedEventIndex, setLastProcessedEventIndex] = useState(-1);

  const { events, status } = useGlobalSocket();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const getSearchPlaceholder = useCallback(() => {
    switch (activeTab) {
      case "contacts":
        return "Buscar contatos...";
      case "groups":
        return "Pesquise um grupo";
      default:
        return "Pesquise um atendimento";
    }
  }, [activeTab]);

  const filterContacts = useCallback((contacts: ContactType[], query: string) => {
    if (!query.trim()) return contacts;
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(query.toLowerCase()) ||
      contact.phone_number.includes(query)
    );
  }, []);

  const filterGroups = useCallback((groups: ContactType[], query: string) => {
    if (!query.trim()) return groups;
    return groups.filter((group) =>
      group.name.toLowerCase().includes(query.toLowerCase())
    );
  }, []);

  // Hook para carregar serviços
  const loadServices = useCallback(async () => {
    try {
      setLoadingServices(true);
      setServicesError(null);

      const url = `/whatsapp/service/get-services?page=1&page_size=100&status__in=in_progress,pending${debouncedSearchQuery ? `&search=${debouncedSearchQuery}` : ""
        }`;

      const res = await authenticatedFetch(url, { method: "GET" });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: ServicesResponse = await res.json();

      setServices(data?.results ?? []);
    } catch (err) {
      setServicesError("Erro ao carregar atendimentos");
    } finally {
      setLoadingServices(false);
    }
  }, [debouncedSearchQuery]);


  // Mapeamento de contatos por telefone (usando contacts das props)
  const contactByPhone = useMemo(() => {
    const map = new Map<string, ContactType>();
    for (const c of contacts) {
      if (c.phone_number) map.set(c.phone_number, c);
    }
    return map;
  }, [contacts]);

  // Processamento de eventos WebSocket
  useEffect(() => {
    if (events.length <= lastProcessedEventIndex + 1) {
      return;
    }

    for (let i = lastProcessedEventIndex + 1; i < events.length; i++) {
      const event = events[i];

      console.log('Evento', event)

      const actions = ["created", "started", "finished", "dismissed", "transferred"];
      const codeActions = ["code_a10000", "code_a40000"];



      if (actions.includes(event.data.action)) {

        if (event.data.action === "created") {

        }
        const newService = createServiceFromEvent(event.data, contactByPhone);
        if (!newService) continue;


        setServices((prev) => {
          const exists = prev.some((s) => s.uuid === newService.uuid);
          if (exists) {
            return prev.map((s) =>
              s.uuid === newService.uuid ? { ...s, ...newService } : s
            );
          }
          return [newService, ...prev];
        });
      }

      if (codeActions.includes(event.data.action)) {
        const serviceUuid = event.data.service_id || event.data.uuid;
        if (!serviceUuid) return;
        setServices((prev) => prev.filter((s) => s.uuid !== serviceUuid));
      }

      if (event.type === "chat.message.global") {
        const messageData = event.data.message || event.data;
        if (!messageData) continue;

        const contactId = messageData.contact_id;
        const serviceId = messageData.service_id;

        if (!contactId || !messageData.text) continue;

        setServices((prev) => {
          return prev.map((service) => {
            if (
              service.contact === contactId ||
              (serviceId && service.uuid === serviceId)
            ) {
              const updatedMessages = service.messages
                ? [...service.messages, messageData]
                : [messageData];

              let newUnreadCount = service.unread_messages_count || 0;
              if (messageData.from_me) {
                newUnreadCount = 0;
              } else {
                newUnreadCount++;
              }

              return {
                ...service,
                messages: updatedMessages,
                unread_messages_count: newUnreadCount,
              };
            }
            return service;
          });
        });
      }
    }

    setLastProcessedEventIndex(events.length - 1);
  }, [events, contactByPhone]);

  // Effect para carregar serviços quando necessário
  useEffect(() => {
    const servicesTabs = ["in_progress", "pending"];
    if (servicesTabs.includes(activeTab)) {
      loadServices();
    }
  }, [activeTab, loadServices]);

  useEffect(() => {
    if (activeTab === "contacts") {
      loadContacts();
    }
  }, [loadContacts, activeTab]);

  useEffect(() => {
    if (activeTab === "groups") {
      loadGroups();
    }
  }, [loadGroups, activeTab]);

  const filteredContactsList = useMemo(() => {
    const individualContacts = contacts.filter(contact => !contact.is_group);
    return filterContacts(individualContacts, searchQuery);
  }, [contacts, searchQuery, filterContacts]);

  const filteredGroupsList = useMemo(() => {
    return filterGroups(groups, searchQuery);
  }, [groups, searchQuery, filterGroups]);

  const { inProgressServices, pendingServices, groupContacts } = useMemo(() => {
    const inProgress = services.filter((s) => s.status === "in_progress");
    const pending = services.filter((s) => s.status === "pending" && !s.contact_is_group);

    return {
      inProgressServices: inProgress,
      pendingServices: pending,
      groupContacts: groups || []
    };
  }, [services, groups]);

  const handleSelectContact = useCallback(
    (c: ContactType) => onSelectContact(c),
    [onSelectContact]
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    if (activeTab === "contacts") {
      onSearchContacts(query);
    }
  }, [activeTab, onSearchContacts]);


  return (
    <div
      className={cn(
        "border-r border-border bg-card transition-all duration-300 flex flex-col h-full",
        isCollapsed ? "w-20" : "w-80",
        isDisabled && "pointer-events-none opacity-50"
      )}
    >
      <SidebarHeader
        isCollapsed={isCollapsed}
        onToggle={onToggle}
        status={status}
      />

      {!isCollapsed ? (
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as ActiveTab)}
          className="flex-1 flex flex-col min-h-0"
        >
          <TabNavigation
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as ActiveTab)}
            inProgressCount={inProgressServices.length}
            pendingCount={pendingServices.length}
            isDisabled={isDisabled}
          />

          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={getSearchPlaceholder()}
            disabled={isDisabled}
          />

          <div className="flex-1 min-h-0">
            <TabContent
              value="pending"
              groups={groupContacts}
              services={pendingServices}
              selectedContact={selectedContact}
              isCollapsed={isCollapsed}
              onSelectContact={handleSelectContact}
              loadingServices={loadingServices}
              servicesError={servicesError}
              isDisabled={isDisabled}
              activeTab={activeTab}
            />

            <TabContent
              value="in_progress"
              services={inProgressServices}
              selectedContact={selectedContact}
              isCollapsed={isCollapsed}
              onSelectContact={handleSelectContact}
              loadingServices={loadingServices}
              servicesError={servicesError}
              isDisabled={isDisabled}
              activeTab={activeTab}
            />

            <TabContent
              value="groups"
              groups={filteredGroupsList}
              selectedContact={selectedContact}
              isCollapsed={isCollapsed}
              onSelectContact={handleSelectContact}
              loadingContacts={loadingContacts}
              contactsError={contactsError}
              isDisabled={isDisabled}
              activeTab={activeTab}
            />

            <TabContent
              value="contacts"
              contacts={filteredContactsList}
              selectedContact={selectedContact}
              isCollapsed={isCollapsed}
              onSelectContact={handleSelectContact}
              loadingContacts={loadingContacts}
              contactsError={contactsError}
              hasNext={hasNext}
              loadMore={loadMore}
              isDisabled={isDisabled}
              activeTab={activeTab}
            />
          </div>
        </Tabs>
      ) : (
        <CollapsedSidebar
          services={inProgressServices}
          selectedContact={selectedContact}
          onSelectContact={handleSelectContact}
          loadingServices={loadingServices}
          servicesError={servicesError}
          isDisabled={isDisabled}
        />
      )}
    </div>
  );
};

export default ChatSidebar;