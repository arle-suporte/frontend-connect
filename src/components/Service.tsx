"use client";

import { useState, useEffect, useMemo } from "react";
import GenericDataTable from "./GenericTable";
import { RotateCcw, Upload, XCircle } from "lucide-react";
import {
  getStatusTitle,
  getStatusClasses,
  getStatusServiceKeys,
} from "@/utils/status";
import { formatDate } from "@/utils/time";
import { ContactType } from "@/types/chat";
import { getServicesPaginated } from "@/services/service/get-services";
import ServiceDetailsModal from "./modal/Service/ServiceDetails";
import { Badge } from "./ui/badge";
import { serializeFilters } from "@/utils/serializeFilters";
import { exportToXLSX } from "@/utils/exportToXLSX";
import { getAllServices } from "@/services/service/get-all-services";
import { formatDateTime } from "@/utils/formatDateTime";
import { Styles } from "@/styles/list";
import { useLoadingButton } from "@/hooks/useLoadingButton";

interface AtendimentosProps {
  contacts: ContactType[];
}

interface PaginationInfo {
  count: number;
  next: string | null;
  previous: string | null;
  results: any[];
}

export default function Atendimentos({ contacts }: AtendimentosProps) {
  const [atendimentos, setAtendimentos] = useState<any[]>([]);
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
  const [detailsModal, setDetailsModal] = useState({
    open: false,
    serviceData: null,
  });

  // Estado dos inputs (filtros em edição)
  const [filters, setFilters] = useState({
    client_name: "",
    contact_name: "",
    status: "",
    service_name: "",
    started_at_after: undefined as Date | undefined,
    started_at_before: undefined as Date | undefined,
  });

  // Estado realmente aplicado (só muda ao clicar em aplicar/remover filtros)
  const [appliedFilters, setAppliedFilters] = useState({ ...filters });

  const hasFiltersApplied = useMemo(() => {
    return Object.values(appliedFilters).some(
      (val: any) =>
        val !== "" &&
        val !== undefined &&
        val !== null &&
        !(
          typeof val === "object" &&
          val.from === undefined &&
          val.to === undefined
        )
    );
  }, [appliedFilters]);

  // Buscar dados
  const fetchAtendimentos = async (
    page: number = currentPage,
    size: number = pageSize,
    usedFilters = appliedFilters
  ) => {
    try {
      setLoading(true);
      setError(null);

      const serializedFilters = serializeFilters(usedFilters);
      const data = await getServicesPaginated(serializedFilters, page, size);

      const mappedData = data.results.map((service: any) => ({
        uuid: service.uuid,
        cliente: service.client_name,
        contato: service.contact_name,
        status: getStatusTitle(service.status),
        status_original: service.status,
        atendido_por: service.user,
        messages: service.messages,
        started_at: service.started_at,
        finished_at: service.finished_at,
        is_group: service.contact_is_group,
        data: formatDate(service.finished_at || service.created_at),
      }));  

      const filteredData = mappedData.filter((service: any) => !service.is_group);

      setAtendimentos(filteredData);
      setPaginationInfo(data);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      console.error("Erro ao buscar atendimentos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    fetchAtendimentos(1, pageSize, appliedFilters);
  }, []);

  // Paginadores
  const handlePageChange = (page: number) => {
    fetchAtendimentos(page, pageSize, appliedFilters);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    fetchAtendimentos(1, newSize, appliedFilters);
  };

  // Limpar filtros
  const clearFilters = () => {
    const reset = {
      client_name: "",
      contact_name: "",
      status: "",
      service_name: "",
      started_at_after: undefined,
      started_at_before: undefined,
    };
    setFilters(reset);
    setAppliedFilters(reset);
    fetchAtendimentos(1, pageSize, reset);
  };

  // Aplicar filtros
  const applyFilters = () => {
    setAppliedFilters(filters);
    fetchAtendimentos(1, pageSize, filters);
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
      const serializedFilters = serializeFilters(appliedFilters);
      const allData = await getAllServices(serializedFilters);
      const mappedData = allData.map((u: any) => ({
        contato: u.contact_name,
        status: getStatusTitle(u.status),
        atendido_por: u.user,
        started_at: formatDateTime(u.started_at),
        finished_at: formatDateTime(u.finished_at),
      }));

      exportToXLSX(mappedData, "atendimentos.xlsx", {
        contato: "Contato",
        status: "Andamento",
        atendido_por: "Responsável",
        started_at: "Iniciado em",
        finished_at: "Finalizado em",
      });
    }
  );

  const columns = [
    {
      key: "cliente",
      header: "Cliente",
      cellClassName: `${Styles.default_text}`,
    },
    {
      key: "contato",
      header: "Contato",
      cellClassName: `${Styles.default_text}`,
    },
    {
      key: "atendido_por",
      header: "Responsável",
      cellClassName: `${Styles.default_text}`,
    },
    {
      key: "status",
      header: "Status",
      render: (value: any, item: any) => {
        const originalStatus = item.status_original;
        return (
          <Badge variant="default" className={getStatusClasses(originalStatus)}>
            {value}
          </Badge>
        );
      },
    },
    {
      key: "started_at",
      header: "Iniciado em",
      render: (value: any) => {
        const start = formatDateTime(value);
        return <Badge variant="outline">{start}</Badge>;
      },
    },
  ];

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
  ];

  const handleRowAction = (action: any, item: any) => {
    console.log(item);

    if (action === "view") {
      setDetailsModal({
        open: true,
        serviceData: item,
      });
    }
  };

  return (
    <div className="space-y-4">
      <GenericDataTable
        title="Atendimentos"
        data={atendimentos}
        columns={columns}
        actions={actions}
        onRowAction={handleRowAction}
        showRowActions={true}
        rowActionsLabel="Ações"
        rowActionsItems={[{ label: "Ver detalhes", action: "view" }]}
        paginationMode="server"
        pagination={pagination}
        loading={loading}
        emptyMessage="Nenhum atendimento encontrado."
        filters={[
          {
            key: "client_name",
            label: "Cliente",
            type: "text",
            value: filters.client_name,
            onChange: (v: string) =>
              setFilters((prev) => ({ ...prev, client_name: v })),
          },
          {
            key: "contact_name",
            label: "Contato",
            type: "text",
            value: filters.contact_name,
            onChange: (v: string) =>
              setFilters((prev) => ({ ...prev, contact_name: v })),
          },
          {
            key: "service_name",
            label: "Responsável",
            type: "text",
            value: filters.service_name,
            onChange: (v: string) =>
              setFilters((prev) => ({ ...prev, service_name: v })),
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            value: filters.status || "all",
            options: getStatusServiceKeys,
            onChange: (v: string) =>
              setFilters((prev) => ({
                ...prev,
                status: v === "all" ? "" : v,
              })),
          },
          {
            key: "started_at",
            label: "Período",
            type: "date",
            value: {
              from: filters.started_at_after,
              to: filters.started_at_before,
            },
            onChange: (range?: { from?: Date; to?: Date }) =>
              setFilters((prev) => ({
                ...prev,
                started_at_after: range?.from,
                started_at_before: range?.to,
              })),
          },
        ]}
      />

      <ServiceDetailsModal
        open={detailsModal.open}
        onClose={() =>
          setDetailsModal({
            open: false,
            serviceData: detailsModal.serviceData,
          })
        }
        serviceData={detailsModal.serviceData}
      />
    </div>
  );
}
