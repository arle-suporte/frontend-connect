"use client";

import { useState } from "react";
import {
  Settings,
  MessageCircle,
  Smartphone,
  UserLock,
  UserRoundCog,
  ClipboardList,
  Users,
  BookUser,
  Building2,
} from "lucide-react";

import SessionConfigModal from "./modal/Settings/SessionConfig";
import SatisfactionModal from "./modal/Settings/Satisfaction";
import UserIdentifierModal from "./modal/Settings/UserIdentifier";
import CannedResponsesModal from "./modal/Settings/responses/CannedResponses";
import UserConfigModal from "./modal/Settings/user/UserConfig";
import ClientConfigModal from "./modal/Settings/client/ClientConfig";
import DepartmentConfigModal from "./modal/Settings/department/DepartmentConfig";

interface UserSettingsProps {
  onSessionConfigured: () => void;
}


export default function UserSettings({ onSessionConfigured }: UserSettingsProps) {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isSatisfactionModalOpen, setIsSatisfactionModalOpen] = useState(false);
  const [isUserIdentifierModalOpen, setIsUserIdentifierModalOpen] =
    useState(false);
  const [isCannedResponsesModalOpen, setIsCannedResponsesModalOpen] =
    useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [departmentConfigModalOpen, setDepartmentConfigModalOpen] =
    useState(false);

  const [satisfactionEnabled, setSatisfactionEnabled] = useState(false);
  const [userIdentifierEnabled, setUserIdentifierEnabled] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] px-6">
      <div className="text-center m-8">
        <h2 className="text-2xl font-semibold">
          Configurações do <span className="text-primary">Connect</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Gerencie preferências, equipes e integrações
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-5xl">
        {[
          {
            icon: Smartphone,
            label: "Configuração do celular",
            action: () => setIsConfigModalOpen(true),
          },
          {
            icon: UserRoundCog,
            label: "Gerenciar colaboradores",
            action: () => setAuthModalOpen(true),
          },
          {
            icon: Building2,
            label: "Gerenciar clientes",
            action: () => setClientModalOpen(true),
          },
          {
            icon: BookUser,
            label: "Gerenciar departamentos",
            action: () => setDepartmentConfigModalOpen(true),
          },
          // {
          //   icon: Users,
          //   label: "Configuração de grupos",
          //   action: () => {},
          // },
          {
            icon: MessageCircle,
            label: "Modelos de mensagens",
            action: () => setIsCannedResponsesModalOpen(true),
          },

          // {
          //   icon: UserLock,
          //   label: "Identificação do usuário",
          //   action: () => setIsUserIdentifierModalOpen(true),
          // },
          // {
          //   icon: ClipboardList,
          //   label: "Pesquisa de satisfação",
          //   action: () => setIsSatisfactionModalOpen(true),
          // },
        ].map(({ icon: Icon, label, action }, i) => (
          <button
            key={i}
            onClick={action}
            className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-card/50 backdrop-blur-md shadow-sm hover:shadow-md border transition hover:bg-accent hover:cursor-pointer"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 mb-3 group-hover:bg-primary/20 transition">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Modals */}
      <SessionConfigModal
        open={isConfigModalOpen}
        onOpenChange={setIsConfigModalOpen}
        onSessionConfigured={onSessionConfigured}
      />
      <SatisfactionModal
        open={isSatisfactionModalOpen}
        onOpenChange={setIsSatisfactionModalOpen}
        isEnabled={satisfactionEnabled}
        onToggleChange={setSatisfactionEnabled}
      />
      <UserIdentifierModal
        open={isUserIdentifierModalOpen}
        onOpenChange={setIsUserIdentifierModalOpen}
        isEnabled={userIdentifierEnabled}
        onToggleChange={setUserIdentifierEnabled}
      />
      <CannedResponsesModal
        open={isCannedResponsesModalOpen}
        onOpenChange={setIsCannedResponsesModalOpen}
      />
      <UserConfigModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
      <ClientConfigModal
        open={clientModalOpen}
        onClose={() => setClientModalOpen(false)}
      />
      <DepartmentConfigModal
        open={departmentConfigModalOpen}
        onClose={() => setDepartmentConfigModalOpen(false)}
      />
    </div>
  );
}
