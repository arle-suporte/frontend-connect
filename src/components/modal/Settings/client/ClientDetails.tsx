"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Building2,
  IdCard,
  User,
  Phone,
  Mail,
  ClipboardCheck,
} from "lucide-react";
import { getStatus } from "@/utils/statusMap";
import { getCompanyType } from "@/utils/status";

interface ClientDetailsProps {
  open: boolean;
  onClose: () => void;
  clientData: any;
}

const ClientDetailsModal: React.FC<ClientDetailsProps> = ({
  open,
  onClose,
  clientData,
}) => {
  if (!clientData) return null;

  const {
    federal_registration,
    company_name,
    trade_name,
    company_type,
    status,
    description,
    social_responsible,
    contact_name,
    contact_email,
    contact_phone,
    status_help_text,
  } = clientData;

  const initials = company_name
    ? company_name
      .split(" ")
      .slice(0, 2)
      .map((p: string) => p[0]?.toUpperCase())
      .join("")
    : "CL";

  const sections = [
    {
      title: "Dados da Empresa",
      items: [
        {
          icon: <IdCard className="h-4 w-4 text-primary" />,
          label: "CNPJ",
          value: federal_registration,
        },
        {
          icon: <Building2 className="h-4 w-4 text-primary" />,
          label: "Razão Social",
          value: company_name,
        },
        {
          icon: <Building2 className="h-4 w-4 text-muted-foreground" />,
          label: "Nome Fantasia",
          value: trade_name || "-",
        },
        {
          icon: <Building2 className="h-4 w-4 text-indigo-600" />,
          label: "Tipo",
          value: getCompanyType(company_type),
        },
      ],
    },
    {
      title: "Situação Cadastral",
      items: [
        {
          icon: <ClipboardCheck className="h-4 w-4 text-indigo-600" />,
          label: "Status",
          value: getStatus(status),
          help: status_help_text,
        },
        {
          icon: <Building2 className="h-4 w-4 text-muted-foreground" />,
          label: "Descrição",
          value: description || "-",
        },
      ],
    },
    {
      title: "Responsável Social",
      items: [
        {
          icon: <User className="h-4 w-4 text-primary" />,
          label: "Nome",
          value: social_responsible || "-",
        },
      ],
    },
    {
      title: "Contato",
      items: [
        {
          icon: <User className="h-4 w-4 text-primary" />,
          label: "Nome",
          value: contact_name,
        },
        {
          icon: <Mail className="h-4 w-4 text-blue-600" />,
          label: "E-mail",
          value: contact_email || "-",
        },
        {
          icon: <Phone className="h-4 w-4 text-green-600" />,
          label: "Telefone",
          value: contact_phone || "-",
        },
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header fixo */}
        <DialogHeader className="flex-shrink-0 border-b pb-3">
          <DialogTitle className="text-xl font-semibold">
            Detalhes do Cliente
          </DialogTitle>
        </DialogHeader>

        {/* Body scrollável */}
        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-8 py-4">
            {sections.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  {section.title}
                </h4>
                <div className="divide-y divide-muted-foreground/10">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 py-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/30 shrink-0">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {item.label}
                        </p>
                        <p className="text-sm font-semibold text-foreground mt-1 break-words">
                          {item.value}
                        </p>
                        {item.help && (
                          <p className="text-xs text-muted-foreground mt-1 break-words">
                            {item.help}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer fixo */}
        <div className="flex-shrink-0 border-t pt-3 mt-2 flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsModal;
