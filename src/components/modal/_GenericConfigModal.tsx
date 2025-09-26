"use client";

import { useState, useEffect, ReactNode } from "react";
import { RotateCcw } from "lucide-react";

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
}

interface RowActionItem {
  label: string;
  action: string;
  condition?: (item: any) => boolean;
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
  filters = {},
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

  const loadData = async (
    page: number = currentPage,
    size: number = pageSize
  ) => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchData(filters, page, size);
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

  const refreshAction: Action = {
    label: "Atualizar",
    icon: <RotateCcw className="h-4 w-4" />,
    onClick: () => loadData(currentPage, pageSize),
    variant: "ghost",
  };

  const combinedActions = [refreshAction, ...actions];

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
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="border-b pb-1">
          <DialogTitle className="flex items-center space-x-2 text-lg font-semibold">
            {icon}
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
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
          />
        </div>

        {children}
      </DialogContent>
    </Dialog>
  );
};

export default GenericConfigModal;
