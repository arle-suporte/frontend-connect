"use client";

import React, { useState, useEffect, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import Header from "@/components/Header";
import ChatSidebar from "@/components/Chat/ChatSidebar";
import ChatInterface from "@/components/Chat/ChatInterface";
import Contato from "@/components/Contact";
import Dashboard from "@/components/Dashboard";
import Atendimentos from "@/components/Service";
import UserSettings from "@/components/Settings";

import { ContactType, Message, ContactsData } from "@/types/chat";

import {
  LayoutDashboard,
  MessageCircle,
  Contact,
  History,
  Settings,
  Menu,
} from "lucide-react";

import { sendText } from "@/services/message/send-text";
import { sendFile } from "@/services/message/send-file";
import { sendAudio } from "@/services/message/send-audio";
import { getContactsPaginated } from "@/services/contact/get-contacts";
import { getGroupsPaginated } from "@/services/contact/get-groups";
import { getServicesPaginated } from "@/services/service/get-services";
import { fetchSessionStatus, SessionState } from "@/services/setting/session/get-session-status";
import { authenticatedFetch } from "@/lib/api-client";
import TabsHeader, { TabConfig } from "@/components/ui/TabsHeader";
import { useIsMobile } from "@/hooks/use-mobile";

interface CRMClientProps {
  accessToken: string | null;
}

const CRMClient: React.FC<CRMClientProps> = ({ accessToken }) => {
  const CRM_TABS: TabConfig[] = [
    { value: "dashboard", label: "Dashboard", icon: LayoutDashboard, },
    { value: "chat", label: "Chat", icon: MessageCircle, showContact: true },
    { value: "contatos", label: "Contatos", icon: Contact },
    { value: "atendimentos", label: "Atendimentos", icon: History },
    { value: "session", label: "Configurações", icon: Settings },
  ];

  const isMobile = useIsMobile();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [contactsError, setContactsError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactType | null>(
    null
  );
  const [servicesData, setServicesData] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
    results: [] as Message[],
  });
  const [loadingServices, setLoadingServices] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [currentPageServices, setCurrentPageServices] = useState(1);
  const [sessionState, setSessionState] = useState<SessionState>("loading");

  // estado só para o drawer mobile
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [contactsData, setContactsData] = useState<ContactsData>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [groupsData, setGroupsData] = useState<ContactsData>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [busca, setBusca] = useState("");
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleToggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const refreshContactInList = useCallback(
    async (contactUuid: string) => {
      try {
        const response = await authenticatedFetch(
          `/whatsapp/contact/${contactUuid}`
        );
        const updatedContact = await response.json();

        setContactsData((prev) => ({
          ...prev,
          results: prev.results.map((contact: any) =>
            contact.uuid === contactUuid ? updatedContact : contact
          ),
        }));

        setShouldScrollToBottom(true);
        setSelectedContact(updatedContact);
      } catch (error) {
        console.error("Erro ao atualizar contato na lista:", error);
      }
    },
    [selectedContact]
  );

  const handleSelectContact = (contact: ContactType) => {
    setSelectedContact(contact);
    setShouldScrollToBottom(true);
    setActiveTab("chat");

    if (selectedContact?.phone_number != contact.phone_number) {
      setServicesData({
        count: 0,
        next: null,
        previous: null,
        results: [],
      });
      setCurrentPageServices(1);
      refreshContactInList(contact.uuid);

      setServicesError(null);
    }
  };

  const fetchContacts = useCallback(async (
    page = currentPage,
    size = pageSize,
    append = false
  ) => {
    try {
      setLoadingContacts(true);
      const effectiveSize = busca ? 2000 : size;

      const data = await getContactsPaginated(
        busca ? { search: busca } : {},
        page,
        effectiveSize
      );

      setContactsData((prev) => ({
        ...data,
        results:
          append && !busca ? [...prev.results, ...data.results] : data.results,
      }));

      setCurrentPage(page);
    } catch (err) {
      setContactsError(
        err instanceof Error ? err.message : "Erro ao carregar contatos."
      );
      setContactsData({ count: 0, next: null, previous: null, results: [] });
    } finally {
      setLoadingContacts(false);
    }
  }, [busca]);

  const fetchGroups = useCallback(async (
    page = currentPage,
    size = 200,
    append = false
  ) => {
    try {
      setLoadingContacts(true);
      const effectiveSize = busca ? 2000 : size;

      const data = await getGroupsPaginated(
        busca ? { search: busca } : {},
        page,
        effectiveSize
      );

      setGroupsData((prev) => ({
        ...data,
        results:
          append && !busca ? [...prev.results, ...data.results] : data.results,
      }));

      setCurrentPage(page);
    } catch (err) {
      setContactsError(
        err instanceof Error ? err.message : "Erro ao carregar grupos."
      );
      setGroupsData({ count: 0, next: null, previous: null, results: [] });
    } finally {
      setLoadingContacts(false);
    }
  }, [busca]);


  const fetchSession = useCallback(async () => {
    const result = await fetchSessionStatus();
    if (result.success && result.sessionState) {
      setSessionState(result.sessionState);
    } else {
      setSessionState("error");
    }
  }, []);

  const handleSessionConfigured = () => {
    fetchSession();
  };

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchServicesByNumber = useCallback(async () => {
    setLoadingServices(true);
    setServicesError(null);

    try {
      const response = await getServicesPaginated(
        { chat_id: selectedContact?.phone_number },
        currentPageServices,
        pageSize
      );

      if (response) {
        setServicesData((prev) => ({
          ...response,
          results:
            currentPageServices === 1
              ? response.results
              : [...prev.results, ...response.results],
        }));
      }
    } catch (err) {
      setServicesError(
        err instanceof Error ? err.message : "Falha ao carregar atendimentos."
      );
    } finally {
      setLoadingServices(false);
    }
  }, [selectedContact?.phone_number, currentPageServices, pageSize]);

  // Remove os dois useEffects existentes e substitui por este:
  useEffect(() => {
    // Se não tem contato selecionado, reseta
    if (!selectedContact) {
      setServicesData({ count: 0, next: null, previous: null, results: [] });
      setCurrentPageServices(1);
      return;
    }

    // Só busca serviços se estiver na aba chat
    if (activeTab === "chat") {
      fetchServicesByNumber().then(() => {
        setShouldScrollToBottom(true);
      });
    }
  }, [selectedContact, currentPageServices, activeTab, fetchServicesByNumber]);

  const handleLoadMore = () => {
    if (servicesData.next) {
      setShouldScrollToBottom(false);
      setCurrentPageServices((prev) => prev + 1);
    }
  };

  const loadMore = useCallback(() => {
    if (contactsData.next && !busca && !loadingContacts) {
      fetchContacts(currentPage + 1, pageSize, true);
    }
  }, [contactsData.next, busca, loadingContacts, currentPage, pageSize, fetchContacts]);

  const handleSendMessage = async (text: string) => {
    if (!selectedContact) return;
    await sendText(selectedContact.phone_number, text, selectedContact);
  };

  const handleSendFileMessage = async (file: File) => {
    if (!selectedContact) return;
    await sendFile(selectedContact.phone_number, file, selectedContact);
  };

  const handleSendAudioMessage = async (file: File) => {
    if (!selectedContact) return;
    await sendAudio(selectedContact.phone_number, file, selectedContact);
  };

  const isChatEnabled = sessionState === "working";

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden ">
      <Header onToggleSidebar={handleToggleSidebar} />

      <div className="flex-1 flex overflow-hidden">
        {isMobile && (
          <Sheet
            open={!isSidebarCollapsed}
            onOpenChange={setIsSidebarCollapsed}
          >
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden absolute top-3 left-3"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <ChatSidebar
                contacts={contactsData.results}
                groups={groupsData.results}
                loadContacts={fetchContacts}
                loadGroups={fetchGroups}
                selectedContact={selectedContact}
                onSelectContact={handleSelectContact}
                isCollapsed={isSidebarCollapsed}
                onToggle={handleToggleSidebar}
                loadingContacts={loadingContacts}
                hasNext={!!contactsData.next}
                loadMore={loadMore}
                isDisabled={!isChatEnabled}
                onSearchContacts={(query) => {
                  setBusca(query);
                  fetchContacts(1, pageSize, false); // busca pelo back-end com page=1
                }}
                contactsError={contactsError}
              />
            </SheetContent>
          </Sheet>
        )}

        {/* Sidebar Desktop */}
        {!isMobile && (
          <aside className="hidden md:block">
            <ChatSidebar
              contacts={contactsData.results}
              groups={groupsData.results}
              loadContacts={fetchContacts}
              loadGroups={fetchGroups}
              selectedContact={selectedContact}
              onSelectContact={handleSelectContact}
              isCollapsed={isSidebarCollapsed}
              onToggle={handleToggleSidebar}
              loadingContacts={loadingContacts}
              contactsError={contactsError}
              hasNext={!!contactsData.next}
              loadMore={() => {
                if (contactsData.next && !busca) {
                  fetchContacts(currentPage + 1, pageSize, true);
                }
              }}
              isDisabled={!isChatEnabled}
              onSearchContacts={(query) => {
                setBusca(query); // atualiza o estado de busca
                fetchContacts(1, pageSize, false); // busca pelo back-end com page=1
              }}
            />
          </aside>
        )}

        <main className="flex-1 flex flex-col overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsHeader
              tabs={CRM_TABS}
              loading={loadingContacts}
              selectedContact={selectedContact}
            />

            <TabsContent value="dashboard" className="flex-1 overflow-y-auto">
              <Dashboard />
            </TabsContent>

            <TabsContent value="chat" className="flex-1 overflow-y-auto">
              {!isChatEnabled ? (
                <div className="flex-1 flex items-center justify-center text-center p-4">
                  <div className="text-sm text-destructive">
                    <p>O chat está desativado. Verifique o status da sua sessão nas configurações.</p>
                  </div>
                </div>
              ) : selectedContact ? (
                servicesError ? (
                  <div className="flex-1 flex items-center justify-center text-center p-4">
                    <div className="text-sm text-destructive">
                      <p>Erro ao carregar atendimentos</p>
                      <p className="text-xs mt-1">{servicesError}</p>
                    </div>
                  </div>
                ) : (
                  <ChatInterface
                    contact={selectedContact}
                    services={servicesData}
                    accessToken={accessToken}
                    onSendMediaMessage={handleSendFileMessage}
                    onSendFileMessage={handleSendFileMessage}
                    onSendMessage={handleSendMessage}
                    onSendAudioMessage={handleSendAudioMessage}
                    loadMore={handleLoadMore}
                    hasMore={!!servicesData.next}
                    shouldScrollToBottom={shouldScrollToBottom}
                    onScrollComplete={() => setShouldScrollToBottom(false)}
                    loadingServices={loadingServices}
                  />
                )
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <MessageCircle className="w-8 h-8 text-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      Selecione uma conversa
                    </h3>
                    <p className="text-foreground">
                      Escolha um contato da barra lateral para começar a
                      conversa.
                    </p>
                    <Button
                      onClick={() => setActiveTab("dashboard")}
                      variant="default"
                      className="mt-4"
                    >
                      Visualizar Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="contatos" className="flex-1 overflow-y-auto">
              <Contato onContactsUpdated={fetchContacts} />
            </TabsContent>

            <TabsContent
              value="atendimentos"
              className="flex-1 overflow-y-auto"
            >
              <Atendimentos contacts={contacts} />
            </TabsContent>

            <TabsContent value="session" className="flex-1 overflow-y-auto">
              <UserSettings onSessionConfigured={handleSessionConfigured} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default CRMClient;
