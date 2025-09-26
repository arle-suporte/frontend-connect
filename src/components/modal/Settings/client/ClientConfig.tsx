"use client";

import { useState } from "react";
import {
  Building2,
  CheckCircle,
  Info,
  Plus,
  Upload,
  XCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useAuth } from "@/contexts/AuthContext";
import { fetchAuthClients } from "@/services/client/get-clients";
import { inactivateClient } from "@/services/client/inactivate-client";
import { reactivateClient } from "@/services/client/reactivate-client";
import { getAllClients } from "@/services/client/get-all-client";

import GenericConfigModal, { FilterItem } from "../../GenericConfigModal";
import CreateClientModal from "./CreateClient";
import ManageClientModal from "./ManageClient";
import ToggleEntityStatusModal from "@/components/ui/ToggleEntityStatusModal";
import { Badge } from "@/components/ui/badge";
import { exportToXLSX } from "@/utils/exportToXLSX";
import {
  getCompanyType,
  getStatusColor,
  getStatusOfficeKeys,
  getTypeOfficeKeys,
} from "@/utils/status";
import { getStatus } from "@/utils/statusMap";
import ClientDetailsModal from "./ClientDetails";
import { useLoadingButton } from "@/hooks/useLoadingButton";

interface ClientConfigModalProps {
  open: boolean;
  onClose: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  undefined: "Indefinido",
  client: "Cliente",
  former_client: "Ex-cliente",
};

const columns = [
  {
    key: "company_name",
    header: "Razão Social",
    cellClassName: "font-medium",
    render: (value: any, item: any) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{value}</span>
        <span className="text-xs font-medium text-foreground/70 uppercase">
          {getCompanyType(item.company_type)}
        </span>
      </div>
    ),
  },
  {
    key: "trade_name",
    header: "Nome Fantasia",
    render: (value: string, item: any) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">{value}</span>
        <span className="text-xs font-medium text-foreground/70">
          {item.federal_registration}
        </span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (value: any, item: any) => {
      const status = STATUS_LABELS[value] ?? "Desconhecido";
      const isInactive = value === "former_client" || value === undefined;

      return (
        <div className="flex items-center">
          <Badge variant="default" className={getStatusColor(value)}>
            {isInactive ? (
              <XCircle className="h-3 w-3 mr-1" />
            ) : (
              <CheckCircle className="h-3 w-3 mr-1" />
            )}
            {status}
          </Badge>

          {item.status_help_text && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.status_help_text}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },
];

const rowActionsItems = [
  { label: "Ver detalhes", action: "view" },
  { label: "Editar", action: "edit" },
  {
    label: "Inativar",
    action: "inactivate",
    condition: (item: { status: string }) =>
      item.status === "client" || item.status === "undefined",
  },
  {
    label: "Reativar",
    action: "reactivate",
    condition: (item: { status: string }) =>
      item.status === "former_client" || item.status === "undefined",
  },
];

const ClientConfigModal = ({ open, onClose }: ClientConfigModalProps) => {
  const { user } = useAuth();

  const [createModal, setCreateModal] = useState(false);
  const [manageModal, setManageModal] = useState({
    open: false,
    clientData: null as any,
  });
  const [inactivateModal, setInactivateModal] = useState({
    open: false,
    uuid: "",
    name: "",
  });
  const [reactivateModal, setReactivateModal] = useState({
    open: false,
    uuid: "",
    name: "",
  });
  const [detailsModal, setDetailsModal] = useState({
    open: false,
    clientData: null as any,
  });

  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {}
  );
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReload = () => setRefreshKey((prev) => prev + 1);

  const { loading: isExporting, handleClick: handleExport } = useLoadingButton(
    async () => {
      const allData = await getAllClients(appliedFilters);
      const mappedData = allData.map((u: any) => ({
        company_name: u.company_name,
        trade_name: u.trade_name,
        federal_registration: u.federal_registration,
        company_type: getCompanyType(u.company_type),
        status: getStatus(u.status),
        contact_name: u.contact_name,
        contact_email: u.contact_email,
        contact_phone: u.contact_phone,
      }));

      exportToXLSX(mappedData, "clientes.xlsx", {
        company_name: "Razão Social",
        trade_name: "Nome Fantasia",
        federal_registration: "CNPJ",
        company_type: "Tipo",
        status: "Situação",
        contact_name: "Nome do Contato",
        contact_email: "E-mail do Contato",
        contact_phone: "Telefone do Contato",
      });
    }
  );

  // --- Buscar dados da tabela ---
  const fetchClients = async (
    filters: Record<string, string>,
    page: number,
    size: number
  ) => {
    setAppliedFilters(filters);
    const data = await fetchAuthClients(filters, page, size);

    const mappedData = data.results.map((client: any) => ({
      uuid: client.uuid,
      company_name: client.company_name,
      trade_name: client.trade_name,
      contact_name: client.contact_name,
      contact_email: client.contact_email,
      contact_phone: client.contact_phone,
      federal_registration: client.federal_registration,
      legal_name: client.organization?.legal_name,
      status: client.status,
      status_help_text: client.status_help_text,
      social_responsible: client.social_responsible,
      description: client.description,
      organization: client.organization.name,
      company_type: client.company_type,
    }));

    return { ...data, results: mappedData };
  };

  const handleRowAction = (action: string, item: any) => {
    switch (action) {
      case "view":
        setDetailsModal({ open: true, clientData: item });
        break;
      case "edit":
        setManageModal({ open: true, clientData: item });
        break;
      case "inactivate":
        setInactivateModal({
          open: true,
          uuid: item.uuid,
          name: item.company_name,
        });
        break;
      case "reactivate":
        setReactivateModal({
          open: true,
          uuid: item.uuid,
          name: item.company_name,
        });
        break;
    }
  };

  // --- Botões principais ---
  const hasCreatePermission = user?.permissions.some(
    (p: any) => p.codename === "auth.create_client"
  );

  const actions = [
    ...(hasCreatePermission
      ? [
          {
            label: "Cadastrar Cliente",
            icon: <Plus className="h-4 w-4" />,
            onClick: () => setCreateModal(true),
          },
        ]
      : []),
    {
      label: isExporting ? "Exportando..." : "Exportar",
      icon: isExporting ? (
        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-500" />
      ) : (
        <Upload className="h-4 w-4" />
      ),
      onClick: handleExport,
      disabled: isExporting,
    },
  ];

  // --- Filtros ---
  const FiltersItems: FilterItem[] = [
    {
      key: "company_name",
      label: "Razão Social",
      type: "text",
      value: appliedFilters.company_name || "",
      onChange: (v: string) =>
        setAppliedFilters((prev) => ({ ...prev, company_name: v })),
    },
    {
      key: "trade_name",
      label: "Nome Fantasia",
      type: "text",
      value: appliedFilters.trade_name || "",
      onChange: (v: string) =>
        setAppliedFilters((prev) => ({ ...prev, trade_name: v })),
    },
    {
      key: "federal_registration",
      label: "CNPJ",
      type: "text",
      value: appliedFilters.federal_registration || "",
      onChange: (v: string) =>
        setAppliedFilters((prev) => ({ ...prev, federal_registration: v })),
    },
    {
      key: "company_type",
      label: "Tipo",
      type: "select",
      options: getTypeOfficeKeys,
      value: appliedFilters.company_type || "all",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: getStatusOfficeKeys,
      value: appliedFilters.status || "all",
    },
  ];

  return (
    <GenericConfigModal
      open={open}
      onClose={onClose}
      title="Clientes"
      tableTitle=""
      icon={<Building2 className="h-6 w-6" />}
      fetchData={fetchClients}
      columns={columns}
      actions={actions}
      rowActionsItems={rowActionsItems}
      onRowAction={handleRowAction}
      emptyMessage="Nenhum cliente encontrado."
      refreshKey={refreshKey}
      filtersItems={FiltersItems}
    >
      <CreateClientModal
        open={createModal}
        onClose={() => setCreateModal(false)}
        onClientCreated={handleReload}
      />

      <ManageClientModal
        open={manageModal.open}
        onClose={() => setManageModal((prev) => ({ ...prev, open: false }))}
        clientData={manageModal.clientData}
        onClientUpdated={handleReload}
      />

      <ToggleEntityStatusModal
        open={inactivateModal.open}
        onClose={() => setInactivateModal((prev) => ({ ...prev, open: false }))}
        uuid={inactivateModal.uuid}
        name={inactivateModal.name}
        isDeleted={false}
        entityLabel="Cliente"
        onConfirm={inactivateClient}
        onFinished={handleReload}
        mode="inactivate"
        icon={Building2}
      />

      <ToggleEntityStatusModal
        open={reactivateModal.open}
        onClose={() => setReactivateModal((prev) => ({ ...prev, open: false }))}
        uuid={reactivateModal.uuid}
        name={reactivateModal.name}
        isDeleted={false}
        entityLabel="Cliente"
        onConfirm={reactivateClient}
        onFinished={handleReload}
        mode="reactivate"
        icon={Building2}
      />

      <ClientDetailsModal
        open={detailsModal.open}
        onClose={() => setDetailsModal({ open: false, clientData: null })}
        clientData={detailsModal.clientData}
      />
    </GenericConfigModal>
  );
};

export default ClientConfigModal;
