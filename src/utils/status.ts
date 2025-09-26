const getStatusTitle = (status: string) => {
  switch (status) {
    case "in_progress":
      return "Atendimento em andamento";
    case "finalized":
      return "Atendimento finalizado";
    case "dismiss":
      return "Atendimento desconsiderado";
    case "pending":
      return "Atendimento pendente";
    case "transferred":
      return "Atendimento transferido";
    default:
      return "Atendimento";
  }
};

const getCompanyType = (type: string) => {
  switch (type) {
    case "branch_office":
      return "Filial";
    case "head_office":
      return "Matriz";
    default:
      return "Indefinido";
  }
};

const getRole = (type: string) => {
  switch (type) {
    case "owner":
      return "Proprietário";
    case "admin":
      return "Administrador";
    case "member":
      return "Membro";
    default:
      return "Indefinido";
  }
};

const getStatusServiceKeys = [
  { label: "Todos", value: "all" },
  { label: "Em andamento", value: "in_progress" },
  { label: "Finalizado", value: "finalized" },
  { label: "Descartado", value: "dismiss" },
  { label: "Pendente", value: "pending" },
  { label: "Transferido", value: "transferred" },
];

const getTypeOfficeKeys = [
  { label: "Todos", value: "all" },
  { label: "Matriz", value: "head_office" },
  { label: "Filial", value: "branch_office" },
  { label: "Indefinido", value: "undefined" },
];

const getStatusOfficeKeys = [
  { label: "Todos", value: "all" },
  { label: "Cliente", value: "client" },
  { label: "Ex-Cliente", value: "former_client" },
  { label: "Indefinido", value: "undefined" },
];

const getStatusCustomerKeys = [
  { label: "Todos", value: "all" },
  { label: "Ativo", value: "active" },
  { label: "Inativo", value: "inactive" },
  { label: "Férias", value: "vacation" },
  { label: "Atestado", value: "sick_leave" },
  { label: "Suspenso", value: "suspended" },
  { label: "Treinamento", value: "training" },
  { label: "Integração", value: "onboarding" },
  { label: "Demitido", value: "dismissed" },
];

const getStatusCustomerAll = [
  { label: "Ativo", value: "active" },
  { label: "Inativo", value: "inactive" },
  { label: "Férias", value: "vacation" },
  { label: "Atestado", value: "sick_leave" },
  { label: "Suspenso", value: "suspended" },
  { label: "Treinamento", value: "training" },
  { label: "Integração", value: "onboarding" },
  { label: "Demitido", value: "dismissed" },
];

const getStatusCustomerLabelByValue = (value: string) => {
  const item = getStatusCustomerKeys.find((el) => el.value === value);
  return item ? item.label : "Indefinido";
};

const getStatusCustomerValueByLabel = (value: string) => {
  const item = getStatusCustomerAll.find((el) => el.label === value);
  return item ? item.value : "Indefinido";
};

const getStatusRoleKeys = [
  { label: "Todos", value: "all" },
  { label: "Proprietário", value: "owner" },
  { label: "Administrador", value: "admin" },
  { label: "Membro", value: "member" },
];

const getStatusCustomerColor = (status: string) => {
  switch (status) {
    case "active":
    case "training":
    case "onboarding":
      return "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30";
    case "dismissed":
      return "bg-red-500/20 text-red-600 border border-red-500/30";
    default:
      return "bg-orange-500/20 text-orange-600 border border-orange-500/30";
  }
};

const getStatusHelper = (value: string) => {
  switch (value) {
    case "active":
      return true;
    case "training":
      return true;
    case "onboarding":
      return true;
    default:
      return false;
  }
};

const getStatusBorderColor = (status: string) => {
  switch (status) {
    case "in_progress":
      return "border-primary";
    case "finalized":
      return "border-emerald-600";
    case "dismiss":
      return "border-destructive";
    case "pending":
      return "bg-amber-600";
    case "transferred":
      return "border-orange-400";
    default:
      return "border-gray-600";
  }
};

const getStatusBgColor = (status: string) => {
  switch (status) {
    case "in_progress":
      return "bg-primary";
    case "finalized":
      return "bg-emerald-600";
    case "dismiss":
      return "bg-destructive";
    case "pending":
      return "bg-amber-600";
    case "transferred":
      return "bg-orange-400";
    default:
      return "bg-gray-500";
  }
};

const getStatusClasses = (status: string) => {
  switch (status) {
    case "in_progress":
      return "bg-primary/20 text-primary border border-primary/30";
    case "finalized":
      return "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30";
    case "dismiss":
      return "bg-red-500/20 text-red-600 border border-red-500/30";
    case "pending":
      return "bg-amber-500/20 text-amber-600 border border-amber-500/30";
    case "transferred":
      return "bg-orange-500/20 text-orange-600 border border-orange-500/30";
    default:
      return "bg-gray-500/20 text-gray-600 border border-gray-500/30";
  }
};

const getStatusUserColor = (is_deleted: boolean) => {
  if (!is_deleted) {
    return "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30";
  } else {
    return "bg-red-500/20 text-red-600 border border-red-500/30";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "client":
      return "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30";
    case "former_client":
      return "bg-red-500/20 text-red-600 border border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-600 border border-gray-500/30";
  }
};

const getStatusBasic = (is_deleted: boolean) => {
  if (!is_deleted) {
    return "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30";
  } else {
    return "bg-red-500/20 text-red-600 border border-red-500/30";
  }
};

export {
  getStatusTitle,
  getStatusBorderColor,
  getStatusBgColor,
  getStatusUserColor,
  getStatusClasses,
  getStatusColor,
  getStatusBasic,
  getStatusServiceKeys,
  getCompanyType,
  getStatusOfficeKeys,
  getTypeOfficeKeys,
  getStatusCustomerKeys,
  getStatusCustomerColor,
  getStatusRoleKeys,
  getRole,
  getStatusCustomerLabelByValue,
  getStatusCustomerValueByLabel,
  getStatusHelper,
};
