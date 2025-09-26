const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  if (diffDays === 1) {
    return "há 1 dia";
  }

  // Mais de 1 dia → mostra "há X dias"
  return `há ${diffDays} dias`;
};


const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
};

const formatDateTime = (isoString: string): string => {
  if (!isoString) return '-';

  try {
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
      return isoString;
    }

    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (error) {
    console.error('Erro ao formatar data/hora:', error);
    return isoString;
  }
};

const calcularTempoAtendimento = (start: string, end: string | null) => {
  if (!start) return '-';
  const inicio = new Date(start);
  const fim = end ? new Date(end) : new Date();
  const diffMs = fim.getTime() - inicio.getTime();

  const horas = Math.floor(diffMs / 3600000);
  const minutos = Math.floor(diffMs / 60000);
  const segundos = Math.floor((diffMs % 60000) / 1000);

  if (horas > 0) {
    return `${horas}h ${minutos}m`;
  } else if (minutos > 0) {
    return `${minutos}m ${segundos}s`;
  } else {
    return `${segundos}s`;
  }
};


export { formatDate, formatTime, formatDateTime, calcularTempoAtendimento }