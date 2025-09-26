"use client";

import { useState } from "react";
import { BookUser, CheckCircle, Plus, Upload, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getDepartments } from "@/services/department/get-departments";
import GenericConfigModal, { FilterItem } from "../../GenericConfigModal";
import CreateDepartmentModal from "./CreateDepartment";
import ManageDepartmentModal from "./ManageDepartment";
import { Badge } from "@/components/ui/badge";
import { Styles } from "@/styles/list";
import {
  get_true_false_status,
  getStatusKeysTrueFalse,
} from "@/utils/statusTrueFalse";
import ToggleEntityStatusModal from "@/components/ui/ToggleEntityStatusModal";
import { inactivateDepartment } from "@/services/department/inactivate-department";
import { reactivateDepartment } from "@/services/department/reactivate-department";
import { exportToXLSX } from "@/utils/exportToXLSX";
import { useLoadingButton } from "@/hooks/useLoadingButton";
import { getAllDpto } from "@/services/department/get-all-departments";

interface DepartmentConfigModalProps {
  open: boolean;
  onClose: () => void;
}

const columns = [
  {
    key: "name",
    header: "Nome",
    cellClassName: Styles.default_text,
  },
  {
    key: "is_deleted",
    header: "Status",
    cellClassName: Styles.default_text,
    render: (value: any) => {
      const color = value
        ? "bg-destructive/20 text-destructive"
        : "bg-emerald-100 text-emerald-700";
      const status = get_true_false_status(value);
      return (
        <Badge variant="default" className={color}>
          {value ? (
            <XCircle className="h-3 w-3 mr-1" />
          ) : (
            <CheckCircle className="h-3 w-3 mr-1" />
          )}
          {status}
        </Badge>
      );
    },
  },
];

const rowActionsItems = [
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

const DepartmentConfigModal = ({
  open,
  onClose,
}: DepartmentConfigModalProps) => {
  const { user } = useAuth();

  const [createDepartmentModal, setCreateDepartmentModal] = useState(false);
  const [manageModal, setManageModal] = useState({
    open: false,
    departmentUuid: "",
    departmentName: "",
  });
  const [inactivateModal, setInactivateModal] = useState({
    open: false,
    departmentUuid: "",
    departmentName: "",
  });
  const [reactivateModal, setReactivateModal] = useState({
    open: false,
    departmentUuid: "",
    departmentName: "",
  });

  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {}
  );

  const [refreshKey, setRefreshKey] = useState(0);
  const handleReload = () => setRefreshKey((prev) => prev + 1);

  const fetchDepartments = async (
    filters: Record<string, string>,
    page: number,
    size: number
  ) => {
    setAppliedFilters(filters);
    const data = await getDepartments(filters, page, size);

    const mappedData = data.results.map((department: any) => ({
      uuid: department.uuid,
      name: department.name,
      is_deleted: department.is_deleted,
    }));

    return { ...data, results: mappedData };
  };

  const handleRowAction = (action: string, item: any) => {
    switch (action) {
      case "edit":
        setManageModal({
          open: true,
          departmentUuid: item.uuid,
          departmentName: item.name,
        });
        break;
      case "inactivate":
        setInactivateModal({
          open: true,
          departmentUuid: item.uuid,
          departmentName: item.name,
        });
        break;
      case "reactivate":
        setReactivateModal({
          open: true,
          departmentUuid: item.uuid,
          departmentName: item.name,
        });
        break;
    }
  };

  const { loading: isExporting, handleClick: handleExport } = useLoadingButton(
    async () => {
      const allData = await getAllDpto(appliedFilters);
      const mappedData = allData.map((u: any) => ({
        name: u.name,
        status: get_true_false_status(u.is_deleted),
      }));

      exportToXLSX(mappedData, "departamentos.xlsx", {
        name: "Nome",
        status: "Status",
      });
    }
  );

  const hasCreateDepartmentPermission = user?.permissions.some(
    (permission: any) => permission.codename === "auth.create_department"
  );

  const actions = [
    ...(hasCreateDepartmentPermission
      ? [
          {
            label: "Cadastrar Departamento",
            icon: <Plus className="h-4 w-4" />,
            onClick: () => setCreateDepartmentModal(true),
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

  const FiltersItems: FilterItem[] = [
    {
      key: "name",
      label: "Nome",
      type: "text",
      value: appliedFilters.name || "",
      onChange: (v: string) =>
        setAppliedFilters((prev) => ({ ...prev, name: v })),
    },
    {
      key: "is_deleted",
      label: "Status",
      type: "select",
      options: getStatusKeysTrueFalse,
      value: appliedFilters.is_deleted || "",
    },
  ];

  return (
    <GenericConfigModal
      open={open}
      onClose={onClose}
      title="Departamentos"
      tableTitle=""
      fetchData={fetchDepartments}
      columns={columns}
      actions={actions}
      rowActionsItems={rowActionsItems}
      onRowAction={handleRowAction}
      emptyMessage="Nenhum departamento encontrado."
      refreshKey={refreshKey}
      filtersItems={FiltersItems}
      icon={<BookUser className="h-6 w-6" />}
    >
      {/* Criar */}
      <CreateDepartmentModal
        open={createDepartmentModal}
        onClose={() => setCreateDepartmentModal(false)}
        onDepartmentCreated={handleReload}
      />

      {/* Editar */}
      <ManageDepartmentModal
        open={manageModal.open}
        onClose={() => setManageModal((prev) => ({ ...prev, open: false }))}
        departmentUuid={manageModal.departmentUuid}
        departmentName={manageModal.departmentName}
        onDepartmentUpdated={handleReload}
      />

      {/* Inativar */}
      <ToggleEntityStatusModal
        open={inactivateModal.open}
        onClose={() => setInactivateModal((prev) => ({ ...prev, open: false }))}
        uuid={inactivateModal.departmentUuid}
        name={inactivateModal.departmentName}
        isDeleted={false}
        entityLabel="Departamento"
        onConfirm={inactivateDepartment}
        onFinished={handleReload}
        mode="inactivate"
        icon={BookUser}
      />

      {/* Reativar */}
      <ToggleEntityStatusModal
        open={reactivateModal.open}
        onClose={() => setReactivateModal((prev) => ({ ...prev, open: false }))}
        uuid={reactivateModal.departmentUuid}
        name={reactivateModal.departmentName}
        isDeleted={false}
        entityLabel="Departamento"
        onConfirm={reactivateDepartment}
        onFinished={handleReload}
        mode="reactivate"
        icon={BookUser}
      />
    </GenericConfigModal>
  );
};

export default DepartmentConfigModal;
