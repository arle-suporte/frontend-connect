'use client'

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import ChatSidebar from "@/components/Chat/ChatSidebar";
import ChatInterface from "@/components/Chat/ChatInterface";
import Contato from "@/components/Contact";
import Dashboard from "@/components/Dashboard";
import Atendimentos from "@/components/Service";
import CreateSession from "@/components/CreateSession";
import { ContactType, Message } from "@/types/chat";
import {
  LayoutDashboard,
  MessageCircle,
  Contact,
  History,
  Loader2,
  Settings
} from "lucide-react";
import { authenticatedFetch } from "@/lib/api-client";
import { sendText } from "@/services/message/send-text";
import { sendFile } from "@/services/message/send-file";
import { sendAudio } from "@/services/message/send-audio";
import { getContactsPaginated } from "@/services/contact/get-contacts";


const CRM = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Estados para a lista de contatos
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [contactsError, setContactsError] = useState<string | null>(null);

  // Estados para o contato selecionado e suas mensagens
  const [selectedContact, setSelectedContact] = useState<ContactType | null>(null);
  const [services, setServices] = useState<Message[]>([]);
  const [loadingservices, setLoadingservices] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [contactsData, setContactsData] = useState({
    count: 0,
    next: null,
    previous: null,
    results: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [busca, setBusca] = useState("")

  // Função para alternar a barra lateral
  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Função para selecionar um contato e mudar para a aba de chat
  const handleSelectContact = (contact: ContactType) => {
    setSelectedContact(contact);
    setActiveTab("chat");
    if (contact.uuid !== selectedContact?.uuid) {
      setServices([]);
    }
    setServicesError(null); // Limpa qualquer erro anterior de mensagem
  };

  const fetchContacts = async (
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

      console.log("Contatos:", data);

      setContactsData((prev) => ({
        ...data,
        results:
          append && !busca
            ? [...prev.results, ...data.results] // concatena só quando não está pesquisando
            : data.results,
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
  };

  const loadMore = () => {
    if (contactsData.next && !busca) {
      fetchContacts(currentPage + 1, pageSize, true);
    }
  };

  const refetchContacts = fetchContacts;

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const fetchServicesByNumber = async () => {
      if (!selectedContact) {
        setServices([]); // Nenhuma mensagem se não houver contato selecionado
        return;
      }

      setLoadingservices(true);
      setServicesError(null); // Limpa erros anteriores de mensagem

      try {
        const response = await authenticatedFetch(`/whatsapp/${selectedContact.phone_number}`)

        const data = await response.json();
        console.log(`Atendimentos para ${selectedContact.name}:`, data);
        setServices(data);

      } catch (err) {
        console.error('Erro ao buscar Atendimentos:', err);
        setServicesError(err instanceof Error ? err.message : 'Falha ao carregar mensagens.');
        setServices([]);
      } finally {
        setLoadingservices(false);
      }
    };

    fetchServicesByNumber();
  }, [selectedContact]); // Roda sempre que o `selectedContact` muda


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

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header
        onToggleSidebar={handleToggleSidebar}
      />

      <div className="flex-1 flex h-[calc(100vh)]">
        {/* Passando os estados de carregamento e erro para o ChatSidebar */}
        <ChatSidebar
          contacts={contactsData.results}
          selectedContact={selectedContact}
          onSelectContact={handleSelectContact}
          isCollapsed={isSidebarCollapsed}
          onToggle={handleToggleSidebar}
          loadingContacts={loadingContacts}
          contactsError={contactsError}
          hasNext={!!contactsData.next}
          loadMore={loadMore}
        />

        <main className="flex-1 flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <div className="border-b border-border px-3 py-1">
              <TabsList className="grid w-fit grid-cols-5 gap-4">
                <TabsTrigger value="dashboard" className="flex items-center">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center">
                  <MessageCircle />
                  <span>Chat</span>
                  {selectedContact && (
                    <span className="text-xs text-foreground">
                      - {selectedContact.name.length > 10
                        ? selectedContact.name.slice(0, 10) + '...'
                        : selectedContact.name}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="contatos" className="flex items-center">
                  <Contact className="ml-1 h-4 w-4" />
                  <span>Contatos</span>
                </TabsTrigger>
                <TabsTrigger value="atendimentos" className="flex items-center">
                  <History />
                  <span>Atendimentos</span>
                </TabsTrigger>
                <TabsTrigger value="session" className="flex items-center">
                  <Settings className="flex items-center" />
                  <span>Criar sessão</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="dashboard" className="flex-1 m-0">
              <Dashboard />
            </TabsContent>

            <TabsContent value="chat" className="flex-1 h-full overflow-auto">
              {selectedContact ? (
                // Exibe loaders ou erros ao carregar mensagens
                loadingservices ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-foreground" />
                    <p className="ml-2 text-foreground">Carregando atendimentos...</p>
                  </div>
                ) : servicesError ? (
                  <div className="flex-1 flex items-center justify-center text-center p-4">
                    <div className="text-sm text-destructive">
                      <p>Erro ao carregar atendimentos</p>
                      <p className="text-xs mt-1">{servicesError}</p>
                    </div>
                  </div>
                ) : (
                  // Renderiza a interface do chat com as mensagens carregadas
                  <ChatInterface
                    contact={selectedContact}
                    services={services} // Passa as mensagens do contato selecionado
                    onSendMediaMessage={handleSendFileMessage}
                    onSendFileMessage={handleSendFileMessage}
                    onSendMessage={handleSendMessage}
                    onSendAudioMessage={handleSendAudioMessage}
                  />
                )
              ) : (
                // Mensagem quando nenhum contato está selecionado
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <MessageCircle className="w-8 h-8 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Selecione uma conversa
                      </h3>
                      <p className="text-foreground">
                        Escolha um contato da barra lateral para começar a conversa.
                      </p>
                    </div>
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
            <TabsContent className="flex-1 m-0" value="contatos">
              <Contato
                onContactsUpdated={refetchContacts}
              />
            </TabsContent>
            <TabsContent className="flex-1 m-0" value="atendimentos">
              <Atendimentos
                contacts={contacts}
              />
            </TabsContent>
            <TabsContent className="flex-1 m-0" value="session">
              <CreateSession />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default CRM;