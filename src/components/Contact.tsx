"use client";

import { useState, useEffect, useMemo } from "react";
import GenericDataTable from "./GenericTable";
import {
  CheckCircle,
  Download,
  Info,
  Plus,
  RotateCcw,
  Upload,
  UserX,
  XCircle,
} from "lucide-react";
import { getStatusColor, getStatusBasic } from "@/utils/status";

import { Badge } from "./ui/badge";
import { exportToXLSX } from "@/utils/exportToXLSX";
import { Styles } from "@/styles/list";
import { getContactsPaginated } from "@/services/contact/get-contacts";
import { getAllContacts } from "@/services/contact/get-all-contacts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cleanPhone, displayName } from "@/utils/transform-contacts";
import { syncContacts } from "@/services/contact/sync-contacts";
import CreateContactModal from "./modal/Contact/CreateContact";
import ContactDetailsModal from "./modal/Contact/ContactDetails";
import EditContactModal from "./modal/Contact/EditContact";
import { formatClientName } from "@/utils/formatClientName";
import {
  get_true_false_status,
  getStatusKeysTrueFalse,
} from "@/utils/statusTrueFalse";
import ToggleEntityStatusModal from "./ui/ToggleEntityStatusModal";
import { inactivateContact } from "@/services/contact/inactivate-contact";
import { reactivateContact } from "@/services/contact/reactivate-contact";
import { useLoadingButton } from "@/hooks/useLoadingButton";

interface ContatosProps {
  refetchContacts?: () => void;
  onContactsUpdated?: () => void;
}

interface PaginationInfo {
  count: number;
  next: string | null;
  previous: string | null;
  results: any[];
}

export default function Contatos(props: ContatosProps) {
  const [contatos, setContatos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isImporting, setIsImporting] = useState(false);
  const [createModal, setCreateModal] = useState({
    open: false,
    contactUuid: "",
    contactName: "",
    clientUuid: "",
    isDeleted: false,
  });
  const [detailsModal, setDetailsModal] = useState({
    open: false,
    contactData: null,
  });
  const [inactivateModal, setInactivateModal] = useState({
    open: false,
    contactUuid: "",
    contactName: "",
    isDeleted: false,
  });
  const [editModal, setEditModal] = useState({
    open: false,
    contactData: null,
  });
  const [reactivateModal, setReactivateModal] = useState({
    open: false,
    contactUuid: "",
    contactName: "",
    isDeleted: false,
  });
  // Estado dos inputs (filtros em edição)
  const [filters, setFilters] = useState({
    client: "",
    name: "",
    phone_number: "",
    is_deleted: "",
  });

  // Estado realmente aplicado (só muda ao clicar em aplicar/remover filtros)
  const [appliedFilters, setAppliedFilters] = useState({ ...filters });

  const hasFiltersApplied = useMemo(() => {
    return Object.values(appliedFilters).some(
      (val) =>
        val !== "" &&
        val !== undefined &&
        val !== null &&
        !(typeof val === "object" && val === undefined)
    );
  }, [appliedFilters]);

  // Buscar dados
  const fetchContacts = async (
    page: number = currentPage,
    size: number = pageSize,
    usedFilters = appliedFilters
  ) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getContactsPaginated(usedFilters, page, size);

      const mappedData = data.results.map((contact: any) => ({
        uuid: contact.uuid,
        name: displayName(contact.name, contact.phone_number),
        contact: cleanPhone(contact.phone_number),
        client: contact.client,
        photo: contact.photo,
        active: contact.active,
        is_deleted: contact.is_deleted,
        service_user: contact.active_service_user,
        service_status: contact.active_service_status,
        service_uuid: contact.active_service_uuid,
        has_service: contact.has_active_service,
        client_name: formatClientName(
          contact.client_name,
          contact.client_federal_registration
        ),
        is_grupo: contact.is_group,
        client_status: contact.client_status,
        client_status_help: contact.client_status_help,
        client_federal_registration: contact.client_federal_registration,
      }));

      setContatos(mappedData);
      setPaginationInfo(data);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      console.error("Erro ao buscar contatos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(1, pageSize, appliedFilters);
  }, []);

  const refetchContacts = () => {
    fetchContacts(currentPage, pageSize, appliedFilters);
    if (props.onContactsUpdated) {
      props.onContactsUpdated();
    }
  };

  const handlePageChange = (page: number) => {
    fetchContacts(page, pageSize, appliedFilters);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    fetchContacts(1, newSize, appliedFilters);
  };

  const handleCloseModal = (
    setState: React.Dispatch<React.SetStateAction<any>>
  ) => {
    setState((prev: any) => ({ ...prev, open: false }));
  };

  const clearFilters = () => {
    const reset = {
      client: "",
      name: "",
      phone_number: "",
      is_deleted: "",
    };
    setFilters(reset);
    setAppliedFilters(reset);
    fetchContacts(1, pageSize, reset);
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    fetchContacts(1, pageSize, filters);
  };

  const totalPages = Math.ceil(paginationInfo.count / pageSize);
  const pagination = {
    currentPage,
    totalPages,
    totalItems: paginationInfo.count,
    itemsPerPage: pageSize,
    hasNext: !!paginationInfo.next,
    hasPrevious: !!paginationInfo.previous,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    loading,
  };

  const { loading: isExporting, handleClick: handleExport } = useLoadingButton(
    async () => {
      const allData = await getAllContacts(appliedFilters);
      const mappedData = allData.map((u: any) => ({
        name: displayName(u.name, u.phone_number),
        contact: cleanPhone(u.phone_number),
        status: get_true_false_status(u.is_deleted),
        client: formatClientName(u.client_name, u.client_federal_registration),
        client_status: get_status(u.client_status),
      }));

      exportToXLSX(mappedData, "contatos.xlsx", {
        name: "Nome",
        contact: "Contato",
        status: "Status",
        client: "Cliente",
        client_status: "Situação",
      });
    }
  );

  const statusMap = {
    undefined: "Indefinido",
    client: "Cliente",
    former_client: "Ex-cliente",
  };

  const get_status = (value: string) =>
    value in statusMap ? statusMap[value as keyof typeof statusMap] : undefined;

  const columns = [
    {
      key: "name",
      header: "Nome",
      cellClassName: `${Styles.default_text}`,
    },
    {
      key: "contact",
      header: "Contato",
      cellClassName: `${Styles.default_text}`,
    },
    {
      key: "is_deleted",
      header: "Status",
      cellClassName: Styles.default_text,
      render: (value: any) => {
        const color = getStatusBasic(value);
        const status = get_true_false_status(value);
        return (
          <Badge variant="default" className={color}>
            {status}
          </Badge>
        );
      },
    },
    {
      key: "client_name",
      header: "Cliente",
      cellClassName: `${Styles.default_text}`,
    },
    {
      key: "client_status",
      header: "Situação",
      render: (value: any, item: any) => {
        const status = get_status(value);
        return (
          <div className="flex items-center">
            {status && (
              <Badge variant="default" className={getStatusColor(value)}>
                {value === "former_client" || value === undefined ? (
                  <XCircle className="h-3 w-3 mr-1" />
                ) : (
                  <CheckCircle className="h-3 w-3 mr-1" />
                )}
                {status}
              </Badge>
            )}
            {status && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.client_status_help}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      },
    },
  ];

  const handleImportContacts = async () => {
    if (isImporting) return;

    setIsImporting(true);
    try {
      await syncContacts();
      refetchContacts();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsImporting(false);
      if (props.onContactsUpdated) {
        props.onContactsUpdated();
      }
    }
  };

  const actions = [
    ...(hasFiltersApplied
      ? [
          {
            label: "Remover filtros",
            icon: <XCircle />,
            variant: "ghost",
            onClick: clearFilters,
          },
        ]
      : []),
    {
      label: "Aplicar filtro",
      icon: <RotateCcw />,
      variant: "ghost",
      onClick: applyFilters,
    },
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
    {
      label: isImporting ? "Sincronizando..." : "Sincronizar contatos",
      icon: isImporting ? (
        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-500" />
      ) : (
        <Download />
      ),
      variant: "ghost",
      onClick: handleImportContacts,
      disabled: isImporting,
    },
    {
      label: "Cadastrar contato",
      icon: <Plus />,
      onClick: () => setCreateModal({ ...createModal, open: true }),
    },
  ];

  const rowActionsItems = [
    { label: "Ver detalhes", action: "view" },
    { label: "Editar", action: "edit" },
    {
      label: "Inativar",
      action: "inactivate",
      condition: (item: { is_deleted: boolean }) => !item.is_deleted,
    },
    {
      label: "Reativar",
      action: "reactivate",
      condition: (item: { is_deleted: boolean }) => item.is_deleted,
    },
  ];

  const FiltersItems = [
    {
      key: "name",
      label: "Nome",
      type: "text",
      value: filters.name,
      onChange: (v: string) => setFilters((prev) => ({ ...prev, name: v })),
    },
    {
      key: "phone_number",
      label: "Número de telefone",
      type: "text",
      value: filters.phone_number,
      onChange: (v: string) =>
        setFilters((prev) => ({ ...prev, phone_number: v })),
    },
    {
      key: "is_deleted",
      label: "Situação",
      type: "select",
      value: filters.is_deleted || "all",
      options: getStatusKeysTrueFalse,
      onChange: (v: string) =>
        setFilters((prev) => ({
          ...prev,
          is_deleted: v === "all" ? "" : v,
        })),
    },
    {
      key: "client",
      label: "Cliente",
      type: "text",
      value: filters.client,
      onChange: (v: string) => setFilters((prev) => ({ ...prev, client: v })),
    },
  ];

  const handleRowAction = (action: any, item: any) => {
    if (action === "view") {
      setDetailsModal({
        open: true,
        contactData: item,
      });
    } else if (action === "edit") {
      setEditModal({
        open: true,
        contactData: item,
      });
    } else if (action === "inactivate") {
      setInactivateModal({
        open: true,
        isDeleted: item.is_deleted,
        contactUuid: item.uuid,
        contactName: item.name,
      });
    } else if (action === "reactivate") {
      setReactivateModal({
        open: true,
        isDeleted: item.is_deleted,
        contactUuid: item.uuid,
        contactName: item.name,
      });
    }
  };

  return (
    <div className="space-y-4">
      <GenericDataTable
        title="Contatos"
        data={contatos}
        columns={columns}
        actions={actions}
        onRowAction={handleRowAction}
        showRowActions={true}
        rowActionsLabel="Ações"
        rowActionsItems={rowActionsItems}
        paginationMode="server"
        pagination={pagination}
        loading={loading}
        emptyMessage="Nenhum atendimento encontrado."
        filters={FiltersItems}
      />

      <CreateContactModal
        open={createModal.open}
        onClose={() => handleCloseModal(setCreateModal)}
        contactName=""
        onContactCreated={refetchContacts}
      />

      <ToggleEntityStatusModal
        open={inactivateModal.open}
        onClose={() => setInactivateModal((prev) => ({ ...prev, open: false }))}
        uuid={inactivateModal.contactUuid}
        name={inactivateModal.contactName}
        isDeleted={inactivateModal.isDeleted}
        entityLabel="Contato"
        onConfirm={inactivateContact}
        onFinished={refetchContacts}
        mode="inactivate"
        icon={UserX}
      />

      <ToggleEntityStatusModal
        open={reactivateModal.open}
        onClose={() => setReactivateModal((prev) => ({ ...prev, open: false }))}
        uuid={reactivateModal.contactUuid}
        name={reactivateModal.contactName}
        isDeleted={reactivateModal.isDeleted}
        entityLabel="Contato"
        onConfirm={reactivateContact}
        onFinished={refetchContacts}
        mode="reactivate"
        icon={UserX}
      />

      <ContactDetailsModal
        open={detailsModal.open}
        onClose={() => handleCloseModal(setDetailsModal)}
        contactData={detailsModal.contactData}
      />

      <EditContactModal
        open={editModal.open}
        onClose={() => handleCloseModal(setEditModal)}
        contactData={editModal.contactData}
        onContactUpdated={refetchContacts}
      />
    </div>
  );
}
