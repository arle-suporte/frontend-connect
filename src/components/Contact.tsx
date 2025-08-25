import React, { useState, useEffect } from 'react';
import { ChevronDown, Contact, Download, Trash, UserPlus } from 'lucide-react';
import GenericDataTable from "./GenericTable";
import CreateContactModal from './modal/Contact/CreateContact';
import { syncContacts } from '@/services/contact/sync-contacts';
import { transformContactData } from '@/utils/transform-contacts';
import InactivateContactModal from './modal/Contact/InactivateContact';
import ContactDetailsModal from './modal/Contact/ShowDetails';
import EditContactModal from './modal/Contact/EditContact';
import ReactivateContactModal from './modal/Contact/ReactivateContact';
import { getContactsPaginated } from '@/services/contact/get-contacts';

interface ContactsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: any[];
}

interface ContatoProps {
  contactsData?: any;
  loadingContacts?: boolean;
  contactsError?: string | null;
  refetchContacts?: () => void;
  onContactsUpdated?: () => void;
}

export default function Contato(props: ContatoProps) {
  // Estados para gerenciar os dados e paginação
  const [contactsData, setContactsData] = useState<ContactsResponse>({
    count: 0,
    next: null,
    previous: null,
    results: []
  });
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [contactsError, setContactsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Estados dos modais (mantidos iguais)
  const [isImporting, setIsImporting] = useState(false);
  const [createModal, setCreateModal] = useState(
    {
      isOpen: false,
      contactUuid: '',
      contactName: '',
      isDeleted: false
    }
  );
  const [inactivateModal, setInactivateModal] = useState({
    isOpen: false,
    contactUuid: '',
    contactName: '',
    isDeleted: false
  });
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    contactData: null
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    contactData: null,
  });
  const [reactivateModal, setReactivateModal] = useState({
    isOpen: false,
    contactUuid: '',
    contactName: '',
    isDeleted: false
  });

  // Função para buscar contatos da API: Apenas para manipular estado
  const fetchContacts = async (filters: any, page: number = currentPage, size: number = pageSize) => {
    try {
      setLoadingContacts(true);
      setContactsError(null);

      const data = await getContactsPaginated(filters, page, size);
      setContactsData(data);
      setCurrentPage(page);

    } catch (err) {
      setContactsError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoadingContacts(false);
    }
  };

  // Carregar dados na montagem do componente
  useEffect(() => {
    fetchContacts({}, 1, pageSize);
  }, []);

  // Função para recarregar contatos (substituindo refetchContacts)
  const refetchContacts = () => {
    fetchContacts({}, currentPage, pageSize);
    if (props.onContactsUpdated) {
      props.onContactsUpdated();
    }
  };

  const handlePageChange = (page: number) => {
    fetchContacts({}, page, pageSize);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    fetchContacts({}, 1, newSize);
  };

  const handleCloseModal = (setState: React.Dispatch<React.SetStateAction<any>>) => {
    setState((prev: any) => ({ ...prev, isOpen: false }));
  };

  // Se estiver carregando na primeira vez, mostra loading
  if (loadingContacts && currentPage === 1 && contactsData.results.length === 0) {
    return (
      <div className="bg-background font-sans text-foreground">
        <div className="mb-6 flex items-center justify-center space-x-2 text-lg font-semibold text-foreground pt-6">
          <Contact />
          <span>Carregando contatos...</span>
        </div>
      </div>
    );
  }

  // Se houver erro, mostra mensagem de erro
  if (contactsError) {
    return (
      <div className="bg-background font-sans text-foreground">
        <div className="mb-6 flex items-center justify-center space-x-2 text-lg font-semibold text-foreground pt-6">
          <Contact />
          <span>Gerenciar contatos</span>
        </div>
        <div className="p-6 text-center">
          <p className="text-red-500 mb-4">Erro ao carregar contatos: {contactsError}</p>
          <button
            onClick={() => fetchContacts(currentPage)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Transforma os dados da API para o formato esperado pela tabela
  const contatos = transformContactData(contactsData.results);

  // Calcular informações de paginação
  const totalPages = Math.ceil(contactsData.count / pageSize);
  const pagination = {
    currentPage,
    totalPages,
    totalItems: contactsData.count,
    itemsPerPage: pageSize,
    hasNext: !!contactsData.next,
    hasPrevious: !!contactsData.previous,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    loading: loadingContacts
  };

  const columns = [
    {
      key: 'nome',
      header: (
        <div className="flex items-center">
          NOME
          <ChevronDown className="ml-1 h-3 w-3 text-foreground" />
        </div>
      ),
      cellClassName: 'whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground'
    },
    {
      key: 'telefone',
      header: 'TELEFONE',
      cellClassName: 'whitespace-nowrap px-6 py-4 text-sm text-foreground'
    },
    // {
    //   key: 'is_deleted',
    //   header: 'STATUS',
    //   cellClassName: 'whitespace-nowrap px-6 py-4 text-sm text-foreground'
    // }
  ];

  const handleImportContacts = async () => {
    if (isImporting) return;

    setIsImporting(true);
    try {
      await syncContacts();
      await refetchContacts();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsImporting(false);
      if (props.onContactsUpdated) {
        props.onContactsUpdated();
      }
    }
  };

  const actions = [
    {
      label: 'Limpar filtro',
      icon: <Trash />,
      variant: 'ghost',
    },
    {
      label: 'SINCRONIZAR CONTATOS',
      icon: <Download />,
      variant: 'ghost',
      onClick: handleImportContacts,
    },
    {
      label: 'CADASTRAR',
      icon: <UserPlus />,
      onClick: () => setCreateModal({ ...createModal, isOpen: true }),
    },
  ];

  // Define as ações de linha com todas as opções possíveis
  const rowActionsItems = [
    { label: "Ver detalhes", action: "view" },
    { label: "Editar", action: "edit" },
    { label: "Inativar", action: "inactivate", condition: (item: { is_deleted: boolean; }) => !item.is_deleted },
    { label: "Reativar", action: "reactivate", condition: (item: { is_deleted: boolean; }) => item.is_deleted }
  ];

  const handleRowAction = (action: any, item: any) => {
    if (action === 'view') {
      console.log(item);
      setDetailsModal({
        isOpen: true,
        contactData: item
      });
    } else if (action === 'edit') {
      setEditModal({
        isOpen: true,
        contactData: item
      });
    } else if (action === 'inactivate') {
      setInactivateModal({
        isOpen: true,
        isDeleted: item.is_deleted,
        contactUuid: item.id,
        contactName: item.nome
      });
    } else if (action === 'reactivate') {
      setReactivateModal({
        isOpen: true,
        isDeleted: item.is_deleted,
        contactUuid: item.id,
        contactName: item.nome
      });
    }
  };

  return (
    <div className="bg-background font-sans text-foreground">
      <div className="mb-6 flex items-center justify-center space-x-2 text-lg font-semibold text-foreground pt-6">
        <Contact />
        <span>Gerenciar contatos</span>
      </div>

      <GenericDataTable
        title="Contatos"
        data={contatos}
        columns={columns}
        filters={[]}
        actions={actions}
        showRowActions={true}
        onRowAction={handleRowAction}
        rowActionsItems={rowActionsItems}
        paginationMode="server"
        pagination={pagination}
        loading={loadingContacts}
        emptyMessage="Nenhum contato encontrado."
      />

      <CreateContactModal
        isOpen={createModal.isOpen}
        onClose={() => handleCloseModal(setCreateModal)}
        contactUuid=""
        contactName=""
        onContactCreated={refetchContacts}
      />

      <InactivateContactModal
        isOpen={inactivateModal.isOpen}
        onClose={() => handleCloseModal(setInactivateModal)}
        isDeleted={inactivateModal.isDeleted}
        contactUuid={inactivateModal.contactUuid}
        contactName={inactivateModal.contactName}
        onContactInactivated={refetchContacts}
      />

      <ReactivateContactModal
        isOpen={reactivateModal.isOpen}
        onClose={() => handleCloseModal(setReactivateModal)}
        isDeleted={reactivateModal.isDeleted}
        contactUuid={reactivateModal.contactUuid}
        contactName={reactivateModal.contactName}
        onContactReactivated={refetchContacts}
      />

      <ContactDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={() => handleCloseModal(setDetailsModal)}
        contactData={detailsModal.contactData}
      />

      <EditContactModal
        isOpen={editModal.isOpen}
        onClose={() => handleCloseModal(setEditModal)}
        contactData={editModal.contactData}
        onContactUpdated={refetchContacts}
      />
    </div>
  );
}