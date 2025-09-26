"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "../ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  CircleUser,
  Search,
} from "lucide-react";

import { ContactType } from "@/types/chat";
import { Message } from "@/types/chat";

import { authenticatedFetch } from "@/lib/api-client";
import useDebounce from "@/hooks/use-debounce";
import { useGlobalSocket } from "@/hooks/useGlobalSocket";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

import { createServiceFromEvent } from "@/utils/websocket/serialize-service";
import { formatTime } from "@/utils/time";
import { cn } from "@/lib/utils";

type ServiceStatus = "in_progress" | "pending";

interface ServiceType {
  uuid: string;
  status: ServiceStatus;
  contact: string;
  contact_full?: ContactType | null;
  user?: string;
  unread_messages_count?: number;
  messages?: Message[];
}

interface ServicesResponse {
  results: ServiceType[];
}

interface ChatSidebarProps {
  selectedContact: ContactType | null;
  onSelectContact: (contact: ContactType) => void;
  isCollapsed: boolean;
  onToggle: () => void;
  contacts: ContactType[];
  loadingContacts: boolean;
  contactsError: string | null;
  hasNext: boolean;
  loadMore: () => void;
}

const ContactItem = React.memo(function ContactItem({
  contact,
  isService = false,
  isActive,
  isCollapsed,
  onClick,
  user,
  unreadMessagesCount,
  lastMessage,
}: {
  contact: ContactType;
  isService?: boolean;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
  user?: string;
  unreadMessagesCount?: number;
  lastMessage?: Message;
}) {
  const isDeleted = contact.is_deleted === true;

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full p-3 h-auto justify-start text-left transition-all duration-200 relative",
        isService && "h-20",
        isActive && "bg-primary/10 border-l-2 border-l-primary",
        !isCollapsed && "hover:bg-primary/5 hover:cursor-pointer",
        isDeleted && "pointer-events-none opacity-50"
      )}
      onClick={onClick}
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
            <AvatarImage src={contact.photo} alt={contact.name} />
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
                    ? `${lastMessage.text.slice(0, 24)}...`
                    : lastMessage.text || "Sem mensagem"}
                </span>
                <span className="whitespace-nowrap">
                  {formatTime(lastMessage.timestamp)}
                </span>
              </div>
            )}
          </div>
        )}

        {isService && (
          <div className="absolute bottom-2 right-2 min-w-[1.2rem] h-5 px-1 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center border-2">
            {unreadMessagesCount}
          </div>
        )}
      </div>
    </Button>
  );
});

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  selectedContact,
  onSelectContact,
  isCollapsed,
  onToggle,
  contacts,
  loadingContacts,
  contactsError,
  hasNext,
  loadMore,
}) => {
  const [activeTab, setActiveTab] = useState<
    "contacts" | ServiceStatus | "groups"
  >("contacts");
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [lastProcessedEventIndex, setLastProcessedEventIndex] = useState(-1);

  const { events, status } = useGlobalSocket();

  // Hook para scroll infinito
  const loadMoreRef = useInfiniteScroll(loadMore, hasNext, loadingContacts);

  const contactByPhone = useMemo(() => {
    const map = new Map<string, ContactType>();
    for (const c of contacts) {
      if (c.phone_number) map.set(c.phone_number, c);
    }
    return map;
  }, [contacts]);

  useEffect(() => {
    // Retorna se não houver novos eventos
    if (events.length <= lastProcessedEventIndex + 1) {
      return;
    }

    // Itera sobre todos os novos eventos que ainda não foram processados
    for (let i = lastProcessedEventIndex + 1; i < events.length; i++) {
      const event = events[i];

      // Processa eventos de serviço
      const actions = [
        "created",
        "started",
        "finished",
        "dismissed",
        "transferred",
      ];
      const codeActions = ["code_a10000", "code_a40000"];

      if (actions.includes(event.data.action)) {
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

      // Processa mensagens de chat
      if (event.type === "chat.message.global") {
        const messageData = event.data.message || event.data;

        if (!messageData) continue;

        const contactId = messageData.contact_id;
        const serviceId = messageData.service_id;

        if (!contactId || !messageData.text) continue;

        setServices((prev) => {
          const newServices = prev.map((service) => {
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
          return newServices;
        });
      }
    }

    // Atualiza o índice do último evento processado
    setLastProcessedEventIndex(events.length - 1);
  }, [events, contactByPhone, setServices, lastProcessedEventIndex]);

  // Separar contatos individuais e grupos
  const individualContacts = useMemo(() => {
    return contacts.filter((contact) => !contact.is_group);
  }, [contacts]);

  const groupContacts = useMemo(() => {
    return contacts.filter((contact) => contact.is_group);
  }, [contacts]);

  const contactByUuid = useMemo(() => {
    const map = new Map<string, ContactType>();
    for (const c of contacts) {
      if (c.uuid) map.set(c.uuid, c);
    }
    return map;
  }, [contacts]);

  const debouncedBusca = useDebounce(busca, 500);

  const loadServices = useCallback(async () => {
    try {
      setLoadingServices(true);
      setServicesError(null);

      const url = `/whatsapp/service/get-services?page=1&page_size=100&status__in=in_progress,pending${
        debouncedBusca ? `&search=${debouncedBusca}` : ""
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
  }, [debouncedBusca]);

  // Carregar serviços quando a aba ou busca mudar
  useEffect(() => {
    const tabs = ["in_progress", "pending", "contacts"];
    if (tabs.includes(activeTab)) {
      loadServices();
    }
  }, [activeTab, loadServices]);

  const inProgressServices = useMemo(
    () => services.filter((s) => s.status === "in_progress"),
    [services]
  );

  const pendingServices = useMemo(
    () =>
      services.filter((s) => {
        const contact = contactByUuid.get(s.contact);
        return s.status === "pending" && contact && !contact.is_group;
      }),
    [services, contactByUuid]
  );

  const handleSelectContact = useCallback(
    (c: ContactType) => onSelectContact(c),
    [onSelectContact]
  );

  const ContactsList: React.FC<{ contactList: ContactType[] }> = ({
    contactList,
  }) => {
    const filtrados = useMemo(() => {
      if (!busca.trim()) return contactList;
      return contactList.filter(
        (c) =>
          c.name.toLowerCase().includes(busca.toLowerCase()) ||
          c.phone_number.includes(busca)
      );
    }, [contactList, busca]);

    if (loadingContacts && contactList.length === 0) {
      return (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (contactsError) {
      return (
        <div className="flex items-center justify-center h-32 text-center p-4">
          <div className="text-sm text-destructive">
            <p className="text-sm mt-1">{contactsError}</p>
          </div>
        </div>
      );
    }

    if (!filtrados?.length) {
      return (
        <div className="flex items-center justify-center h-32 text-center p-4">
          <p className="text-sm text-muted-foreground">
            {activeTab === "groups"
              ? "Nenhum grupo encontrado."
              : "Nenhum contato encontrado."}
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="space-y-1">
          {filtrados.map((contact) => (
            <ContactItem
              key={contact.uuid ?? contact.phone_number}
              contact={contact}
              isActive={selectedContact?.uuid === contact.uuid}
              isCollapsed={isCollapsed}
              onClick={() => handleSelectContact(contact)}
            />
          ))}
        </div>

        {/* Elemento observado para scroll infinito */}
        {hasNext && (
          <div ref={loadMoreRef} className="flex justify-center py-4">
            {loadingContacts && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        )}
      </>
    );
  };

  const ServicesList: React.FC<{ list: ServiceType[] }> = ({ list }) => {
    const filtrados = useMemo(() => {
      if (!busca.trim()) return list;
      return list.filter((s) => {
        const mapped = contactByUuid.get(s.contact) || null;
        return mapped?.name?.toLowerCase().includes(busca.toLowerCase());
      });
    }, [list, busca, contactByUuid]);

    if (loadingServices) {
      return (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (servicesError) {
      return (
        <div className="flex items-center justify-center h-32 text-center p-4">
          <div className="text-sm text-destructive">
            <p className="text-sm mt-1">{servicesError}</p>
          </div>
        </div>
      );
    }

    if (!filtrados.length && !isCollapsed) {
      return (
        <div className="flex items-center justify-center h-32 text-center p-4">
          <p className="text-sm text-muted-foreground">
            Nenhum atendimento encontrado
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {filtrados.map((service) => {
          const mapped = contactByUuid.get(service.contact) || null;

          if (!mapped) return null;

          const lastMessage =
            service.messages && service.messages.length > 0
              ? service.messages[service.messages.length - 1]
              : undefined;

          return (
            <ContactItem
              key={service.uuid}
              contact={mapped}
              isService
              isActive={selectedContact?.uuid === mapped.uuid}
              isCollapsed={isCollapsed}
              onClick={() => handleSelectContact(mapped)}
              user={service.user}
              unreadMessagesCount={service.unread_messages_count}
              lastMessage={lastMessage}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "border-r border-border bg-card transition-all duration-300 flex flex-col h-full",
        isCollapsed ? "w-20" : "w-80"
      )}
    >
      <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-lg">Chat</h2>
            {/* Indicador de status do WebSocket */}
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                status === "connection open"
                  ? "bg-green-500"
                  : status === "connecting..."
                  ? "bg-yellow-500"
                  : "bg-red-500"
              )}
            />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {!isCollapsed ? (
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="flex-shrink-0 border-b border-border">
            <TabsList className="w-full justify-start rounded-xl h-auto p-0">
              <TabsTrigger
                value="pending"
                className="text-xs flex items-center rounded-xl gap-2"
              >
                <span>Pendente</span>
                <Badge variant="destructive" className="h-4 px-1 text-xs">
                  {pendingServices.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="in_progress"
                className="text-xs flex items-center rounded-xl gap-2"
              >
                <span>Em andamento</span>
                <Badge variant="default" className="h-4 px-1 text-xs">
                  {inProgressServices.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="groups"
                className="text-xs flex items-center rounded-xl gap-2"
              >
                <span>Grupos</span>
              </TabsTrigger>
            </TabsList>
            <TabsList className="w-full justify-start rounded-xl h-auto p-0 mt-2">
              <TabsTrigger
                value="contacts"
                className="text-xs flex items-center rounded-xl gap-2"
              >
                <span>Contatos</span>
              </TabsTrigger>
            </TabsList>

            <div className="relative w-75 ml-2 mt-3 mb-3">
              <Input
                type="text"
                placeholder={
                  activeTab === "groups"
                    ? "Pesquise um grupo"
                    : activeTab === "contacts"
                    ? "Pesquise um contato"
                    : "Pesquise um atendimento"
                }
                className="pl-9 pr-3 py-2 text-sm rounded-md"
                onChange={(e) => setBusca(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <TabsContent value="pending" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-2">
                  <ServicesList list={pendingServices} />
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="in_progress" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-2">
                  <ServicesList list={inProgressServices} />
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="groups" className="flex flex-col h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-2 space-y-1">
                  <ContactsList contactList={groupContacts} />
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="contacts" className="flex flex-col h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-2 space-y-1">
                  <ContactsList contactList={individualContacts} />
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="space-y-2 p-2">
              {loadingServices ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : servicesError ? (
                <div className="text-center text-sm text-destructive p-2">
                  {servicesError}
                </div>
              ) : inProgressServices.length > 0 ? (
                inProgressServices.map((service) => {
                  const mapped = contactByUuid.get(service.contact) || null;
                  if (!mapped) return null;

                  return (
                    <ContactItem
                      key={service.uuid}
                      contact={mapped}
                      isService
                      isActive={selectedContact?.uuid === mapped.uuid}
                      isCollapsed={isCollapsed}
                      onClick={() => handleSelectContact(mapped)}
                      unreadMessagesCount={service.unread_messages_count}
                    />
                  );
                })
              ) : (
                <div className="text-center text-sm text-muted-foreground"></div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
