"use client";
import {
  MoreHorizontal,
  ArrowLeft,
  ArrowRight,
  NotebookPen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo, useEffect } from "react";
import { DatePicker } from "./DatePicker";
import { Label } from "./ui/label";

interface TableFilter {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "custom";
  value?: any;
  options?: { label: string; value: string }[];
  onChange: (value: any) => void;
  component?: React.ReactNode;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}

interface GenericDataTableProps {
  title?: string;
  data?: any[];
  columns?: any[];
  filters?: any[];
  actions?: any[];
  onRowAction?: (action: string, item: any) => void;
  showRowActions?: boolean;
  rowActionsLabel?: string;
  rowActionsItems?: any[];
  showPagination?: boolean;
  itemsPerPage?: number;
  paginationMode?: string;
  pagination?: PaginationProps;
  loading?: boolean;
  emptyMessage?: string;
}

export default function GenericDataTable({
  title = "",
  data = [],
  columns = [],
  filters = [],
  actions = [],
  onRowAction = () => { },
  showRowActions = true,
  rowActionsLabel = "Ações",
  rowActionsItems = [{ label: "Ver detalhes", action: "view" }],
  showPagination = true,
  itemsPerPage = 5,
  paginationMode = "server",
  pagination,
  loading = false,
  emptyMessage = "Nenhum item encontrado.",
}: GenericDataTableProps) {
  // Estado para paginação client-side (mantido para compatibilidade)
  const [currentPage, setCurrentPage] = useState(1);

  // Reset página quando dados mudarem (útil para filtros)
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // Paginação client-side (original)
  const paginatedData = useMemo(() => {
    return data;
  }, [data, currentPage, itemsPerPage, paginationMode]);

  // Cálculos para paginação
  const paginationInfo = useMemo(() => {
    if (pagination) {
      return {
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        hasNext: pagination.hasNext,
        hasPrevious: pagination.hasPrevious,
        itemsPerPage: pagination.itemsPerPage,
      };
    }

    // Modo client-side
    const totalPages = Math.ceil(data.length / itemsPerPage);
    return {
      currentPage,
      totalPages,
      totalItems: data.length,
      hasNext: currentPage < totalPages,
      hasPrevious: currentPage > 1,
      itemsPerPage,
    };
  }, [data.length, currentPage, itemsPerPage, paginationMode, pagination]);

  // Handlers de navegação
  const handlePreviousPage = () => {
    if (pagination) {
      if (pagination.hasPrevious) {
        pagination.onPageChange(pagination.currentPage - 1);
      }
    }
  };

  const handleNextPage = () => {
    if (paginationMode === "server" && pagination) {
      if (pagination.hasNext) {
        pagination.onPageChange(pagination.currentPage + 1);
      }
    }
  };

  const handlePageSizeChange = (newPageSize: string) => {
    const pageSize = parseInt(newPageSize);

    if (paginationMode === "server" && pagination) {
      pagination.onPageSizeChange(pageSize);
    } else {
      setCurrentPage(1); // Reset para primeira página
    }
  };

  const renderCellContent = (item: any, column: any) => {
    const value = item[column.key];

    if (column.render) {
      return column.render(value, item);
    }

    if (column.type === "badge") {
      const variant = column.getBadgeVariant
        ? column.getBadgeVariant(value, item)
        : "default";
      return (
        <Badge variant={variant} className="text-xs px-1.5 py-0.5">
          {value}
        </Badge>
      );
    }

    return value;
  };

  // Função para filtrar as ações baseada no item
  const getFilteredRowActions = (item: any) => {
    return rowActionsItems.filter((actionItem) => {
      // Se a ação tem uma condição, verifica se deve ser exibida
      if (actionItem.condition) {
        return actionItem.condition(item);
      }
      // Se não tem condição, sempre exibe
      return true;
    });
  };

  // Calcular range de itens exibidos
  const getItemRange = () => {
    if (paginationInfo.totalItems === 0) return { start: 0, end: 0 };

    const start =
      (paginationInfo.currentPage - 1) * paginationInfo.itemsPerPage + 1;
    const end = Math.min(
      paginationInfo.currentPage * paginationInfo.itemsPerPage,
      paginationInfo.totalItems
    );

    return { start, end };
  };

  const { start, end } = getItemRange();

  return (
    <div className="px-5">
      <h2 className="text-lg font-medium">{title}</h2>
      <div className="flex flex-wrap items-center justify-end gap-4 py-2">
        {filters.map((filter) => {
          switch (filter.type) {
            case "text":
              return (
                <div
                  key={filter.key}
                  className="flex flex-col gap-1 w-full sm:w-auto"
                >
                  <Label htmlFor={filter.key} className="text-xs font-medium">
                    {filter.label}
                  </Label>
                  <input
                    id={filter.key}
                    type="text"
                    value={filter.value || ""}
                    onChange={(e) => filter.onChange(e.target.value)}
                    placeholder="..."
                    className="border rounded px-2 py-1 text-sm"
                  />
                </div>
              );

            case "select":
              return (
                <div
                  key={filter.key}
                  className="flex flex-col gap-1 w-full sm:w-auto"
                >
                  <Label htmlFor={filter.key} className="text-xs font-medium">
                    {filter.label}
                  </Label>
                  <Select
                    value={filter.value || undefined}
                    onValueChange={filter.onChange}
                  >
                    <SelectTrigger
                      id={filter.key}
                      className="border rounded px-2 py-1 text-sm w-full sm:w-[200px]"
                    >
                      <SelectValue placeholder={`Selecione ${filter.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options?.map((opt: any) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );

            case "date":
              return (
                <div
                  key={filter.key}
                  className="flex flex-col gap-1 w-full sm:w-auto"
                >
                  <Label className="text-xs font-medium">{filter.label}</Label>
                  <DatePicker
                    text={filter.label}
                    value={filter.value}
                    onChange={filter.onChange}
                  />
                </div>
              );

            case "custom":
              return (
                <div
                  key={filter.key}
                  className="flex flex-col gap-1 w-full sm:w-auto"
                >
                  <Label className="text-xs font-medium">{filter.label}</Label>
                  {filter.component}
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 py-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "ghost"}
            className="flex items-center justify-center"
            onClick={action.onClick}
            disabled={loading}
          >
            {action.icon && (
              <span className="flex items-center justify-center">
                {action.icon}
              </span>
            )}
            {action.label}
          </Button>
        ))}
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="h-8">
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className={`text-xs py-2 uppercase ${column.headerClassName}`}
                >
                  {column.header}
                </TableHead>
              ))}
              {showRowActions && (
                <TableHead className="text-right text-xs py-2 uppercase">
                  ações
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Estado de loading
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showRowActions ? 1 : 0)}
                  className="text-center py-8"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    <span className="text-sm text-gray-500">Carregando...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              // Estado vazio
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showRowActions ? 1 : 0)}
                  className="text-center py-8"
                >
                  <span className="text-sm text-gray-500">{emptyMessage}</span>
                </TableCell>
              </TableRow>
            ) : (
              // Dados normais
              paginatedData.map((item, index) => {
                const filteredActions = getFilteredRowActions(item);

                return (
                  <TableRow key={item.id || index} className="h-10">
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className={`text-sm py-2 ${column.cellClassName}`}
                      >
                        {renderCellContent(item, column)}
                      </TableCell>
                    ))}
                    {showRowActions && (
                      <TableCell className="text-right py-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              disabled={loading}
                            >
                              <span className="sr-only">Abrir menu</span>
                              <NotebookPen className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="text-xs">
                              {rowActionsLabel}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {filteredActions.map((actionItem, actionIndex) => (
                              <DropdownMenuItem
                                key={actionIndex}
                                className="text-xs"
                                onClick={() =>
                                  onRowAction(actionItem.action, item)
                                }
                              >
                                {actionItem.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && paginationInfo.totalItems > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-t gap-3">
          {/* Informações da paginação */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <div className="text-sm text-foreground">
              Mostrando {start} a {end} de {paginationInfo.totalItems}{" "}
              resultados
            </div>

            {/* Seletor de itens por página */}
            {paginationMode === "server" && pagination && (
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <span className="text-sm text-foreground">
                  Itens por página:
                </span>
                <Select
                  value={paginationInfo.itemsPerPage.toString()}
                  onValueChange={handlePageSizeChange}
                  disabled={loading}
                >
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Controles de navegação */}
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3"
              onClick={handlePreviousPage}
              disabled={!paginationInfo.hasPrevious || loading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>

            <div className="flex items-center space-x-1 text-sm text-foreground">
              Página {paginationInfo.currentPage} de {paginationInfo.totalPages}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3"
              onClick={handleNextPage}
              disabled={!paginationInfo.hasNext || loading}
            >
              Próximo
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
