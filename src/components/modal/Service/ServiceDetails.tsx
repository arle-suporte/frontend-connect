import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  UserCircle,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Contact,
  Play,
  Flag,
  MessageSquare,
  Info,
} from "lucide-react";

import { formatDateTime, calcularTempoAtendimento } from "@/utils/time";
import { getStatusBgColor } from "@/utils/status";
import { MessageBubble } from "@/components/Chat/interface/MessageBubble";
import { DetailCard } from "@/components/ui/DetailCard";

interface AtendimentoDetailsModalProps {
  open: boolean;
  onClose: () => void;
  serviceData: any;
}

const ServiceDetailsModal = ({
  open,
  onClose,
  serviceData,
}: AtendimentoDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState("details");

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
    contact_photo,
    messages = [],
  } = serviceData;

  console.log(serviceData);

  const tempoAtendimento = calcularTempoAtendimento(started_at, finished_at);

  const detailItems = [
    {
      icon: <User className="h-5 w-5 text-primary" />,
      iconBg: "bg-primary/10",
      label: "Cliente",
      value: cliente,
    },
    {
      icon: (
        <Contact className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      ),
      iconBg: "bg-primary/10",
      label: "Contato",
      value: contato,
    },
    {
      icon: <UserCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />,
      iconBg: "bg-gray-100 dark:bg-gray-800",
      label: "Responsável",
      value: atendido_por,
    },
    {
      icon:
        status_original !== "finalized" ? (
          <XCircle className="h-5 w-5 text-white" />
        ) : (
          <CheckCircle className="h-5 w-5 text-white" />
        ),
      iconBg: getStatusBgColor(status_original),
      label: "Status",
      value: status,
    },
    {
      icon: <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      iconBg: "bg-amber-100 dark:bg-amber-900",
      label: "Tempo de atendimento",
      value: tempoAtendimento,
    },
    {
      icon: <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />,
      iconBg: "bg-green-100 dark:bg-green-900",
      label: "Data",
      value: data,
    },
    {
      icon: <Play className="h-5 w-5 text-primary" />,
      iconBg: "bg-primary/10",
      label: "Início",
      value: formatDateTime(started_at),
    },
    {
      icon: <Flag className="h-5 w-5 text-red-600 dark:text-red-400" />,
      iconBg: "bg-red-100 dark:bg-red-900",
      label: "Fim",
      value: finished_at ? formatDateTime(finished_at) : "Em andamento",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[100vh] flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-1xl font-semibold text-center">
            Detalhes do Atendimento
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
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
            <div className="grid grid-cols-4 gap-4 mb-4">
              {detailItems.map((item, idx) => (
                <DetailCard key={idx} {...item} />
              ))}
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
                      contactName={contato}
                      contactPicture={contact_photo}
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

        <div className="flex justify-end align-baseline">
          <Button variant="ghost" onClick={onClose} className="px-8">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailsModal;
