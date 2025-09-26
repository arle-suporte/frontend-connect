"use client";

import { useState } from "react";
import {
  UserRoundCog,
  User,
  Mail,
  Briefcase,
  CheckCircle,
  XCircle,
  UserPlus,
  Upload,
  Info,
  Plus,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/utils/time";
import { fetchAllUsers, fetchAuthUsers } from "@/services/user/get-users";
import { exportToXLSX } from "@/utils/exportToXLSX";
import {
  getRole,
  getStatusColor,
  getStatusCustomerColor,
  getStatusCustomerKeys,
  getStatusCustomerLabelByValue,
  getStatusHelper,
  getStatusRoleKeys,
  getStatusUserColor,
} from "@/utils/status";

import GenericConfigModal, { FilterItem } from "../../GenericConfigModal";
import CreateUserModal from "./CreateUser";
import ManageUserModal from "./ManageUser";
import ToggleEntityStatusModal from "@/components/ui/ToggleEntityStatusModal";
import { inactivateUser } from "@/services/user/inactivate-user";
import { reactivateUser } from "@/services/user/reactivate-user";
import { Styles } from "@/styles/list";
import { getAllUser } from "@/services/user/get-all-user";
import UserDetailsModal from "./UserDetails";
import { Label } from "@/components/ui/label";
import { useLoadingButton } from "@/hooks/useLoadingButton";

const columns = [
  {
    key: "name",
    header: "Colaborador",
    render: (value: string, item: any) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">{value}</span>
        {item.position_data && (
          <span className="text-xs text-foreground/70">
            {item.position_data?.name}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "role_display",
    header: "Cargo",
    cellClassName: `${Styles.default_text}`,
  },
  {
    key: "email",
    header: "E-mail",
    cellClassName: `${Styles.default_text}`,
  },
  {
    key: "immediate_superior_data",
    header: "Superior",
    render: (
      value: { name?: string; email?: string } | null | undefined,
      _item: any
    ) => {
      if (!value) {
        return (
          <span className="text-xs text-muted-foreground">Não definido</span>
        );
      }

      return (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-foreground">
            {value.name || "-"}
          </span>
          <span className="text-xs text-muted-foreground">
            {value.email || "-"}
          </span>
        </div>
      );
    },
  },

  {
    key: "status",
    header: "Status",
    render: (value: any, item: any) => {
      const isActive = getStatusHelper(value);
      return (
        <div className="flex items-center">
          <Badge variant="default" className={getStatusCustomerColor(value)}>
            {isActive ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <XCircle className="h-3 w-3 mr-1" />
            )}
            {getStatusCustomerLabelByValue(value)}
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

// --- Ações por linha ---
const rowActionsItems = [
  { label: "Ver detalhes", action: "view" },
  { label: "Editar", action: "edit" },
  // {
  //   label: "Inativar",
  //   action: "inactivate",
  //   condition: (item: { is_deleted: boolean }) => !item.is_deleted,
  // },
  // {
  //   label: "Reativar",
  //   action: "reactivate",
  //   condition: (item: { is_deleted: boolean }) => item.is_deleted,
  // },
];

interface UserConfigModalProps {
  open: boolean;
  onClose: () => void;
}

const UserConfigModal = ({ open, onClose }: UserConfigModalProps) => {
  const { user } = useAuth();

  const [createModal, setCreateModal] = useState(false);
  const [manageModal, setManageModal] = useState({
    open: false,
    userData: null as any,
  });
  const [detailsModal, setDetailsModal] = useState({
    open: false,
    userData: null as any,
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
  const { loading: isExporting, handleClick: handleExport } = useLoadingButton(
    async () => {
      const allData = await getAllUser(appliedFilters);
      const mappedData = allData.map((u: any) => ({
        name: u.name,
        position: u.position_data?.name || "-",
        role: getRole(u.role),
        email: u.email,
        status: getStatusCustomerLabelByValue(u.status),
        status_help_text: u.status_help_text || "-",
        extension_number: u.extension_number || "-",
        birthday: u.birthday ? formatDate(u.birthday) : "-",
        immediate_superior_name: u.immediate_superior_data?.name || "-",
        immediate_superior_email: u.immediate_superior_data?.email || "-",
      }));

      exportToXLSX(mappedData, "colaboradores.xlsx", {
        name: "Nome",
        position: "Ocupação",
        role: "Cargo",
        email: "E-mail",
        status: "Status",
        status_help_text: "Descrição",
        extension_number: "Ramal",
        birthday: "Data de Nascimento",
        immediate_superior_name: "Superior Imediato",
        immediate_superior_email: "Contato do Superior Imediato",
      });
    }
  );

  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {}
  );

  const [refreshKey, setRefreshKey] = useState(0);
  const handleReload = () => setRefreshKey((prev) => prev + 1);

  const fetchUsers = async (
    filters: Record<string, string>,
    page: number,
    size: number
  ) => {
    setAppliedFilters(filters);
    const data = await fetchAuthUsers(filters, page, size);

    const mappedData = data.results.map((u: any) => ({
      uuid: u.uuid,
      name: u.name,
      email: u.email,
      is_deleted: u.is_deleted,
      extension_number: u.extension_number,
      status: u.status,
      position: u.position,
      position_data: u.position_data,
      status_help_text: u.status_help_text,
      birthday: u.birthday,
      immediate_superior: u.immediate_superior,
      immediate_superior_data: u.immediate_superior_data,
      role: u.role,
      role_display: getRole(u.role),
      date_joined: formatDate(u.date_joined),
      avatar: u.avatar,
    }));

    return { ...data, results: mappedData };
  };

  const handleRowAction = (action: string, item: any) => {
    switch (action) {
      case "edit":
        setManageModal({ open: true, userData: item });
        break;
      case "view":
        setDetailsModal({ open: true, userData: item });
        console.log(item);
        break;
      case "inactivate":
        setInactivateModal({
          open: true,
          uuid: item.uuid,
          name: item.name,
        });
        break;
      case "reactivate":
        setReactivateModal({
          open: true,
          uuid: item.uuid,
          name: item.name,
        });
        break;
    }
  };

  const hasCreatePermission = user?.permissions.some(
    (p: any) => p.codename === "auth.create_user"
  );

  const actions = [
    ...(hasCreatePermission
      ? [
          {
            label: "Cadastrar Colaborador",
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
      key: "email",
      label: "E-mail",
      type: "text",
      value: appliedFilters.email || "",
      onChange: (v: string) =>
        setAppliedFilters((prev) => ({ ...prev, email: v })),
    },
    {
      key: "position_name",
      label: "Ocupação",
      type: "text",
      value: appliedFilters.position || "",
      onChange: (v: string) =>
        setAppliedFilters((prev) => ({ ...prev, position: v })),
    },
    {
      key: "role",
      label: "Cargo",
      type: "select",
      options: getStatusRoleKeys,
      value: appliedFilters.role || "",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: getStatusCustomerKeys,
      value: appliedFilters.status || "",
    },
  ];

  return (
    <GenericConfigModal
      open={open}
      onClose={onClose}
      title="Colaboradores"
      tableTitle=""
      icon={<UserRoundCog className="h-6 w-6" />}
      fetchData={fetchUsers}
      columns={columns}
      actions={actions}
      rowActionsItems={rowActionsItems}
      onRowAction={handleRowAction}
      emptyMessage="Nenhum colaborador encontrado."
      refreshKey={refreshKey}
      filtersItems={FiltersItems}
    >
      <CreateUserModal
        open={createModal}
        onClose={() => setCreateModal(false)}
        onUserCreated={handleReload}
      />

      <ManageUserModal
        open={manageModal.open}
        onClose={() => setManageModal({ open: false, userData: null })}
        userData={manageModal.userData}
        onUserUpdated={handleReload}
      />

      <UserDetailsModal
        open={detailsModal.open}
        onClose={() => setDetailsModal({ open: false, userData: null })}
        userData={detailsModal.userData}
      />

      <ToggleEntityStatusModal
        open={inactivateModal.open}
        onClose={() => setInactivateModal({ open: false, uuid: "", name: "" })}
        uuid={inactivateModal.uuid}
        name={inactivateModal.name}
        isDeleted={false}
        entityLabel="Colaborador"
        onConfirm={inactivateUser}
        onFinished={handleReload}
        mode="inactivate"
        icon={User}
      />

      <ToggleEntityStatusModal
        open={reactivateModal.open}
        onClose={() => setReactivateModal({ open: false, uuid: "", name: "" })}
        uuid={reactivateModal.uuid}
        name={reactivateModal.name}
        isDeleted={false}
        entityLabel="Colaborador"
        onConfirm={reactivateUser}
        onFinished={handleReload}
        mode="reactivate"
        icon={User}
      />
    </GenericConfigModal>
  );
};

export default UserConfigModal;
