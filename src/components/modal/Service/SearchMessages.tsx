import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageBubble } from '@/components/Chat/interface/MessageBubble';
import { Search, X, MessageSquare, Calendar, Loader2 } from 'lucide-react';
import { formatDate } from '@/utils/time';
import { Message } from '@/types/chat';
import { getStatusTitle } from '@/utils/status';

interface Service {
  uuid: string;
  status: string;
  created_at: string;
  user?: string;
  messages: Message[];
}

interface SearchResult {
  service: Service;
  message: Message & { created_at?: string }; // garante acesso ao created_at
}

interface SearchMessagesModalProps {
  open: boolean;
  onClose: () => void;
  contactId: string;
  contactName: string;
  contactPhoto?: string;
  contactPhoneNumber: string
}

type GroupBy = 'service' | 'date';

const SearchMessagesModal: React.FC<SearchMessagesModalProps> = ({
  open,
  onClose,
  contactId,
  contactName,
  contactPhoto,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // NOVO: controle de organização
  const [groupBy, setGroupBy] = useState<GroupBy>('service');

  const searchMessages = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/whatsapp/${contactId}/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Erro ao pesquisar mensagens');
      }
      const data = await response.json();
      console.log('resultados:', data)
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Erro na pesquisa:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => searchMessages(searchTerm);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setHasSearched(false);
  };

  useEffect(() => {
    if (!open) clearSearch();
  }, [open]);


  // Agrupar por atendimento
  const groupedByService = useMemo(() => {
    if (groupBy !== 'service') return [];

    // 1. Agrupar por service.uuid
    const grouped: Record<string, SearchResult[]> = searchResults.reduce(
      (acc, result) => {
        const serviceId = result.service.uuid;
        if (!acc[serviceId]) {
          acc[serviceId] = [];
        }
        acc[serviceId].push(result);
        return acc;
      },
      {} as Record<string, SearchResult[]>
    );

    // 2. Transformar em lista [uuid, resultados[]]
    const entries = Object.entries(grouped);

    // 3. Ordenar atendimentos pela data de criação (mais recente primeiro)
    entries.sort(([, resultsA], [, resultsB]) => {
      const dateA = new Date(resultsA[0].service.created_at).getTime();
      const dateB = new Date(resultsB[0].service.created_at).getTime();
      return dateB - dateA;
    });

    return entries;
  }, [groupBy, searchResults]);

  const isGroup = contactId?.endsWith('@g.us') ? true : false;

  const renderResultCard = (result: SearchResult) => (
    <div key={result.message.uuid} className="rounded-lg p-4 space-y-3">
      <div className="space-y-4">
        <div className="relative">
          <div className="relative">
            <MessageBubble
              message={{ ...result.message, text: result.message.text }}
              contactName={contactName}
              contactPicture={contactPhoto}
              service={result.service.uuid}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Pesquisar Mensagens
            <div className="flex items-center gap-2 ml-auto mr-5">
              <Avatar className="h-6 w-6">
                <AvatarImage src={contactPhoto || "?"} alt={contactName} />
                <AvatarFallback className="text-xs">
                  {contactName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-normal">{contactName}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Barra de busca + seletor de organização */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Input
              placeholder="Digite sua pesquisa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10 h-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Button onClick={handleSearch} disabled={!searchTerm.trim() || isSearching}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-4">
            {isSearching && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2 text-primary" />
                <span className="text-muted-foreground">Pesquisando mensagens...</span>
              </div>
            )}

            {!isSearching && hasSearched && searchResults.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Nenhuma mensagem encontrada para "{searchTerm}"
                </p>
              </div>
            )}

            {/* Renderização por atendimento */}
            {groupBy === 'service' &&
              groupedByService.map(([serviceId, results]) => {
                const service = results[0].service;

                return (
                  <div key={serviceId} className="space-y-3">
                    {!isGroup && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Atendimento iniciado em {formatDate(service.created_at)} - {getStatusTitle(service.status)}
                        </span>
                      </div>
                    )}
                    {results.map(renderResultCard)}
                  </div>
                );
              })}

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SearchMessagesModal;
