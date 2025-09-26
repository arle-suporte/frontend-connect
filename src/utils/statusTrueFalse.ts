export const get_true_false_status = (value: boolean) => {
  let status = "Ativo";
  if (value === true) {
    status = "Inativo";
  }
  return status;
};

export const getStatusKeysTrueFalse = [
  { label: "Todos", value: "all" },
  { label: "Ativo", value: "false" },
  { label: "Inativo", value: "true" },
];
