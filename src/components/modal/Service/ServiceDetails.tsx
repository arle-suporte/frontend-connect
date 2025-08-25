import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, UserCircle, Clock, CheckCircle, XCircle, Calendar, Contact, Play, Flag, MessageSquare, Info } from 'lucide-react';
import { formatDateTime } from '@/utils/time';
import { getStatusBgColor } from '@/utils/status';
import { MessageBubble } from '@/components/Chat/MessageBubble';

interface AtendimentoDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceData: any;
}

const ServiceDetailsModal = ({ isOpen, onClose, serviceData }: AtendimentoDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!serviceData) return null;

  const {
    uuid,
    cliente,
    contato,
    atendido_por,
    status,
    status_original,
    data,
    started_at,
    finished_at,
    messages = [],
  } = serviceData;

  // Função para calcular tempo de atendimento
  const calcularTempoAtendimento = (start: string, end: string | null) => {
    if (!start) return '-';
    const inicio = new Date(start);
    const fim = end ? new Date(end) : new Date();
    const diffMs = fim.getTime() - inicio.getTime();

    const horas = Math.floor(diffMs / 3600000);
    const minutos = Math.floor(diffMs / 60000);
    const segundos = Math.floor((diffMs % 60000) / 1000);

    if (horas > 0) {
      return `${horas}h ${minutos}m`;
    } else if (minutos > 0) {
      return `${minutos}m ${segundos}s`;
    } else {
      return `${segundos}s`;
    }
  };

  const tempoAtendimento = calcularTempoAtendimento(started_at, finished_at);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-semibold text-center">
            Detalhes do Atendimento
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Detalhes
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Histórico ({messages.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="flex-1 overflow-auto">
            {/* Grid 3x3 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Card 1 - Cliente */}
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cliente</p>
                      <p className="text-sm font-semibold text-foreground mt-1">{cliente}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2 - Contato */}
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Contact className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contato</p>
                      <p className="text-sm font-semibold text-foreground mt-1">{contato}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3 - Atendido por */}
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <UserCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Atendido por</p>
                      <p className="text-sm font-semibold text-foreground mt-1">{atendido_por}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4 - Status */}
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${getStatusBgColor(status_original)}`}
                    >
                      {status_original !== 'finalized' ? (
                        <XCircle className="h-5 w-5 text-white" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</p>
                      <p className={`text-sm font-semibold mt-1`}>
                        {status}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 5 - Tempo de Atendimento */}
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                      <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tempo de atendimento</p>
                      <p className="text-sm font-semibold text-foreground mt-1">{tempoAtendimento}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 6 - Data */}
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                      <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Data</p>
                      <p className="text-sm font-semibold text-foreground mt-1">{data}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 7 - Horário Início */}
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Play className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Início</p>
                      <p className="text-sm font-semibold text-foreground mt-1">{formatDateTime(started_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 8 - Horário Fim */}
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                      <Flag className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fim</p>
                      <p className="text-sm font-semibold text-foreground mt-1">
                        {finished_at ? formatDateTime(finished_at) : 'Em andamento'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="flex-1 overflow-auto">
            <ScrollArea className="h-full max-h-[400px] pr-4">
              {messages.length > 0 ? (
                <div className="space-y-2">
                  {messages.map((message: any, index: number) => (
                    <MessageBubble
                      key={message.id || index}
                      message={message}
                      contactName={cliente}
                      contactPicture={serviceData.contact_picture}
                      service={serviceData}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma mensagem encontrada</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Botão */}
        <div className="flex justify-end">
          <Button variant="ghost" onClick={onClose} className="px-8">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailsModal;