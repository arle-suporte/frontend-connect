import { useState, useEffect } from 'react';
import GenericDataTable from "./GenericTable";
import { RotateCcw, Upload } from 'lucide-react';
import { getStatusBgColor, getStatusTitle, getStatusBorderColor } from '@/utils/status';
import { formatDate } from '@/utils/time';
import { ContactType } from '@/types/chat';
import { getServicesPaginated } from '@/services/service/get-services';
import ServiceDetailsModal from './modal/Service/ServiceDetails';

interface AtendimentosProps {
  contacts: ContactType[];
}

interface PaginationInfo {
  count: number;
  next: string | null;
  previous: string | null;
  results: any[];
}

export default function Atendimentos({ contacts }: AtendimentosProps) {
  const [atendimentos, setAtendimentos] = useState<[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    count: 0,
    next: null,
    previous: null,
    results: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    serviceData: null
  });

  // Função para buscar os dados da API
  const fetchAtendimentos = async (page: number = currentPage, size: number = pageSize) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getServicesPaginated(filters, page, size);
      console.log(data)

      // Mapear os dados da API para o formato esperado pela tabela
      const mappedData = data.results.map((service: any) => ({
        uuid: service.uuid,
        cliente: service.contact_name,
        contato: service.contact_name,
        status: getStatusTitle(service.status),
        status_original: service.status,
        atendido_por: service.user,
        messages: service.messages,
        started_at: service.started_at,
        finished_at: service.finished_at,
        data: formatDate(service.finished_at || service.created_at),
      }));

      setAtendimentos(mappedData);
      setPaginationInfo(data);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar atendimentos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Buscar dados quando o componente montar
  useEffect(() => {
    fetchAtendimentos();
  }, []);

  // Handlers da paginação
  const handlePageChange = (page: number) => {
    fetchAtendimentos(page, pageSize);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    fetchAtendimentos(1, newSize); // Voltar para primeira página
  };

  // Calcular informações de paginação para o componente
  const totalPages = Math.ceil(paginationInfo.count / pageSize);
  const pagination = {
    currentPage,
    totalPages,
    totalItems: paginationInfo.count,
    itemsPerPage: pageSize,
    hasNext: !!paginationInfo.next,
    hasPrevious: !!paginationInfo.previous,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    loading
  };

  const columns = [
    {
      key: 'cliente',
      header: 'Cliente',
      cellClassName: 'font-medium'
    },
    {
      key: 'contato',
      header: 'Contato'
    },
    {
      key: 'status',
      header: 'Status',
      type: 'badge',
      render: (value: any, item: any) => {
        const originalStatus = item.status_original;
        const bgColor = getStatusBgColor(originalStatus);
        const borderColor = getStatusBorderColor(originalStatus);

        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white border ${bgColor} ${borderColor}`}
          >
            {value}
          </span>
        );
      }
    },
    {
      key: 'atendidoPor',
      header: 'Atendido Por'
    },
    {
      key: 'data',
      header: 'Data'
    }
  ];

  const actions = [
    {
      label: 'Atualizar',
      icon: <RotateCcw />,
      variant: 'ghost',
      onClick: () => fetchAtendimentos(currentPage)
    },
    {
      label: 'EXPORTAR DADOS',
      icon: <Upload />,
      onClick: () => {
        console.log('Exportando dados...', atendimentos);
      }
    },
  ];

  const handleRowAction = (action: any, item: any) => {
    if (action === 'view') {
      console.log(item)
      setDetailsModal({
        isOpen: true,
        serviceData: item
      });
    }
  };

  // Mostrar estado de loading inicial
  if (loading && currentPage === 1 && atendimentos.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Carregando atendimentos...</p>
        </div>
      </div>
    );
  }

  // Mostrar erro se houver
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center text-red-600">
          <p className="mb-4">Erro ao carregar atendimentos:</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => fetchAtendimentos(currentPage)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GenericDataTable
        title="Atendimentos"
        data={atendimentos}
        columns={columns}
        actions={actions}
        onRowAction={handleRowAction}
        showRowActions={true}
        rowActionsLabel="Ações"
        rowActionsItems={[{ label: "Ver detalhes", action: "view" }]}
        paginationMode="server"
        pagination={pagination}
        loading={loading}
        emptyMessage="Nenhum atendimento encontrado."
      />

      <ServiceDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, serviceData: detailsModal.serviceData })}
        serviceData={detailsModal.serviceData}
      />

    </div>
  );
}