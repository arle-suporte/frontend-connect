"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Calendar,
  Briefcase,
  ClipboardCheck,
  Phone,
} from "lucide-react";
import { getRole, getStatusCustomerLabelByValue } from "@/utils/status";
import { formatDate } from "@/utils/time";

interface UserDetailsProps {
  open: boolean;
  onClose: () => void;
  userData: any;
}

interface SectionItem {
  icon: React.ReactElement;
  label: string;
  value: any;
  help?: any;
}

interface Section {
  title: string;
  items: SectionItem[];
}

const UserDetailsModal: React.FC<UserDetailsProps> = ({
  open,
  onClose,
  userData,
}) => {
  if (!userData) return null;

  const {
    name,
    email,
    birthday,
    extension_number,
    role,
    position,
    immediate_superior,
    status_help_text,
    status,
    avatar,
    immediate_superior_data,
    position_data,
  } = userData;

  console.log(userData);

  const initials = name
    ? name
        .split(" ")
        .slice(0, 2)
        .map((p: string) => p[0]?.toUpperCase())
        .join("")
    : "US";

  const sections: Section[] = [
    {
      title: "Dados Pessoais",
      items: [
        {
          icon: <User className="h-4 w-4 text-primary" />,
          label: "Nome",
          value: name,
        },
        {
          icon: <Mail className="h-4 w-4 text-blue-600" />,
          label: "E-mail",
          value: email,
        },
        {
          icon: <Calendar className="h-4 w-4 text-indigo-600" />,
          label: "Data de Nascimento",
          value: birthday ? formatDate(birthday) : "-",
        },
      ],
    },
    {
      title: "Cargo e Hierarquia",
      items: [
        {
          icon: <Briefcase className="h-4 w-4 text-primary" />,
          label: "Cargo",
          value: getRole(role),
        },
        {
          icon: <Briefcase className="h-4 w-4 text-indigo-600" />,
          label: "Ocupação",
          value: position_data?.name || "-",
        },
        {
          icon: <Phone className="h-4 w-4 text-green-600" />,
          label: "Ramal",
          value: extension_number || "-",
        },
        {
          icon: <User className="h-4 w-4 text-muted-foreground" />,
          label: "Superior Imediato",
          value: immediate_superior_data?.name || "-",
        },
      ],
    },
    {
      title: "Status",
      items: [
        {
          icon: <ClipboardCheck className="h-4 w-4 text-primary" />,
          label: "Status",
          value: status ? getStatusCustomerLabelByValue(status) : "-",
          help: status_help_text, // ✅ Agora é tipado corretamente
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
            Detalhes do Colaborador
          </DialogTitle>
        </DialogHeader>

        {/* Body scrollável */}
        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-8 py-4">
            {/* Avatar */}
            <div className="flex justify-center">
              <Avatar className="h-24 w-24 border shadow">
                {avatar ? (
                  <AvatarImage src={avatar || "?"} alt={name} />
                ) : (
                  <AvatarFallback>{initials}</AvatarFallback>
                )}
              </Avatar>
            </div>

            {/* Seções */}
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

export default UserDetailsModal;
