
export interface Atendimento {
  id: string;
  cliente: string;
  contato: string;
  status: "Concluído" | "Pendente" | "Cancelado" | "Em andamento";
  atendidoPor: string;
  data: string;
}