"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Phone,
  User,
  Building,
  CheckCircle,
  XCircle,
  MessageSquare,
  Activity,
} from "lucide-react";
import { displayName } from "@/utils/transform-contacts";
import { getStatus } from "@/utils/statusMap";
import { getStatusTitle } from "@/utils/status";

interface ContactDetailsProps {
  open: boolean;
  onClose: () => void;
  contactData: any;
}

const ContactDetailsModal: React.FC<ContactDetailsProps> = ({
  open,
  onClose,
  contactData,
}) => {
  if (!contactData) return null;

  const {
    name,
    contact,
    client_name,
    client_status,
    client_status_help,
    photo,
    is_deleted,
    service_user,
    service_status,
    has_service,
    is_group,
  } = contactData;

  const initials = displayName(name, contact);

  const infoItems = [
    {
      icon: <User className="h-4 w-4 text-primary" />,
      label: "Nome",
      value: displayName(name, contact),
    },
    {
      icon: <Phone className="h-4 w-4 text-green-600" />,
      label: "Contato",
      value: is_group ? "Grupo" : contact,
    },
    {
      icon: !is_deleted ? (
        <CheckCircle className="h-4 w-4 text-emerald-600" />
      ) : (
        <XCircle className="h-4 w-4 text-red-600" />
      ),
      label: "Status",
      value: !is_deleted ? "Ativo" : "Inativo",
    },
    {
      icon: <Building className="h-4 w-4 text-indigo-600" />,
      label: "Cliente",
      value: client_name || "Nenhum cliente atribuído",
    },
    {
      icon: <Activity className="h-4 w-4 text-purple-600" />,
      label: "Status do Cliente",
      value: getStatus(client_status) || "-",
      help: client_status_help,
    },
    {
      icon: <MessageSquare className="h-4 w-4 text-blue-600" />,
      label: "Atendimento Ativo",
      value: has_service
        ? `${getStatusTitle(service_status)} por ${service_user}`
        : "Nenhum atendimento no momento",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        {/* Cabeçalho */}
        <DialogHeader className="flex flex-col items-center pb-6">
          <Avatar className="h-24 w-24 mb-3">
            <AvatarImage src={photo || "?"} alt={name} className="object-cover" />
            <AvatarFallback className="text-lg font-semibold bg-primary/10">
              {initials}
            </AvatarFallback>
          </Avatar>
          <DialogTitle className="text-xl font-semibold">
            Detalhes do Contato
          </DialogTitle>
        </DialogHeader>

        {/* Lista de informações */}
        <div className="divide-y divide-muted-foreground/20">
          {infoItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/30">
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-foreground mt-1">
                  {item.value}
                </p>
                {item.help && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.help}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Botão */}
        <div className="flex justify-end pt-6">
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDetailsModal;
