const getStatusTitle = (status: string) => {
  switch (status) {
    case 'in_progress':
      return 'Atendimento em andamento';
    case 'finalized':
      return 'Atendimento finalizado';
    case 'dismiss':
      return 'Atendimento desconsiderado';
    case 'pending':
      return 'Atendimento pendente';
    case 'transferred':
      return 'Atendimento transferido';
    default:
      return 'Atendimento';
  }
};

const getStatusBorderColor = (status: string) => {
  switch (status) {
    case 'in_progress':
      return 'border-primary';
    case 'finalized':
      return 'border-emerald-600';
    case 'dismiss':
      return 'border-destructive';
    case 'pending':
      return 'bg-amber-600';
    case 'transferred':
      return 'border-orange-400';
    default:
      return 'border-gray-600';
  }
};

const getStatusBgColor = (status: string) => {
  switch (status) {
    case 'in_progress':
      return 'bg-primary';
    case 'finalized':
      return 'bg-emerald-600';
    case 'dismiss':
      return 'bg-destructive';
    case 'pending':
      return 'bg-amber-600';
    case 'transferred':
      return 'bg-orange-400';
    default:
      return 'bg-gray-500';
  }
};

export { getStatusTitle, getStatusBorderColor, getStatusBgColor }