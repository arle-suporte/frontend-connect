"use client";

import { useState, useEffect, ReactNode, useMemo } from "react";
import { RotateCcw, XCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import GenericDataTable from "@/components/GenericTable";

interface PaginatedData {
  count: number;
  next: string | null;
  previous: string | null;
  results: any[];
}

interface Action {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: string;
  disabled?: boolean;
}

interface RowActionItem {
  label: string;
  action: string;
  condition?: (item: any) => boolean;
}

export interface FilterItem {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "custom";
  options?: { value: string; label: string }[];
  value?: string | number | boolean; 
  onChange?: (value: string) => void; 
}


interface GenericConfigModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  tableTitle: string;
  icon?: ReactNode;
  fetchData: (
    filters: Record<string, string>,
    page: number,
    size: number
  ) => Promise<PaginatedData>;
  columns: any[];
  actions?: Action[];
  rowActionsItems?: RowActionItem[];
  onRowAction?: (action: string, item: any) => void;
  rowActionsLabel?: string;
  paginationMode?: "server" | "client";
  emptyMessage?: string;
  filters?: Record<string, string>;
  filtersItems?: FilterItem[];
  refreshKey?: number;
  children?: ReactNode;
}

const GenericConfigModal = ({
  open,
  onClose,
  title,
  tableTitle,
  icon,
  fetchData,
  columns,
  actions = [],
  rowActionsItems = [],
  onRowAction,
  rowActionsLabel = "Ações",
  paginationMode = "server",
  emptyMessage = "Nenhum registro encontrado.",
  filters: initialFilters = {},
  filtersItems = [],
  refreshKey,
  children,
}: GenericConfigModalProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [dataInfo, setDataInfo] = useState<PaginatedData>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });

  // --- Filtros ---
  const [filters, setFilters] =
    useState<Record<string, string>>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<Record<string, string>>(initialFilters);

  const hasFiltersApplied = useMemo(() => {
    return Object.values(appliedFilters).some(
      (val) => val !== "" && val !== undefined && val !== null
    );
  }, [appliedFilters]);

  const clearFilters = () => {
    const reset = Object.fromEntries(
      filtersItems.map((f) => [f.key, f.type === "select" ? undefined : ""])
    ) as Record<string, string>;

    setFilters(reset);
    setAppliedFilters(reset);
    loadData(1, pageSize, reset);
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    loadData(1, pageSize, filters);
  };

  // --- Carregar dados ---
  const loadData = async (
    page: number = currentPage,
    size: number = pageSize,
    usedFilters: Record<string, string> = appliedFilters
  ) => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchData(usedFilters, page, size);
      setItems(data.results);
      setDataInfo(data);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, refreshKey]);

  const handleClose = () => {
    setError("");
    setCurrentPage(1);
    onClose();
  };

  const handlePageChange = (page: number) => {
    loadData(page, pageSize);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    loadData(1, newSize);
  };

  const filterActions: Action[] = [
    ...(hasFiltersApplied
      ? [
        {
          label: "Remover filtros",
          icon: <XCircle className="h-4 w-4" />,
          onClick: clearFilters,
          variant: "ghost",
        },
      ]
      : []),
    ...(filtersItems.length > 0
      ? [
        {
          label: "Aplicar filtros",
          icon: <RotateCcw className="h-4 w-4" />,
          onClick: applyFilters,
          variant: "ghost",
        },
      ]
      : []),
  ];

  const combinedActions = [...filterActions, ...actions];

  // --- Preparar filtros para a tabela ---
  const tableFilters = filtersItems.map((f) => ({
    ...f,
    value:
      f.type === "select"
        ? filters[f.key] === undefined || filters[f.key] === ""
          ? "all"
          : filters[f.key]
        : filters[f.key] ?? "",
    onChange: (v: string) =>
      setFilters((prev) => ({
        ...prev,
        [f.key]: f.type === "select" ? (v === "all" ? "" : v) : v,
      })),
  }));

  // --- Paginação ---
  const totalPages = Math.ceil(dataInfo.count / pageSize);
  const pagination = {
    currentPage,
    totalPages,
    totalItems: dataInfo.count,
    itemsPerPage: pageSize,
    hasNext: !!dataInfo.next,
    hasPrevious: !!dataInfo.previous,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    loading,
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="xl:max-w-6xl w-full max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-3">
          <DialogTitle className="text-lg font-semibold">
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-1">
          <div className="space-y-4 py-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
                <Button
                  onClick={() => loadData(currentPage, pageSize)}
                  variant="default"
                >
                  Tentar novamente
                </Button>
              </div>
            )}

            <GenericDataTable
              title={tableTitle}
              data={items}
              columns={columns}
              actions={combinedActions}
              showRowActions={rowActionsItems.length > 0}
              onRowAction={onRowAction}
              rowActionsItems={rowActionsItems}
              rowActionsLabel={rowActionsLabel}
              paginationMode={paginationMode}
              pagination={pagination}
              loading={loading}
              emptyMessage={emptyMessage}
              filters={tableFilters}
            />
          </div>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default GenericConfigModal;
