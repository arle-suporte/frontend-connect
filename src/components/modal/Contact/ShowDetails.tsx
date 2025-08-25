import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, CheckCircle, XCircle, X } from 'lucide-react';

interface contactDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  contactData: any
}

const ContactDetailsModal: React.FC<contactDetailsProps> = ({ isOpen, onClose, contactData }) => {
  if (!contactData) return null;

  const { nome, photo, telefone, is_deleted } = contactData;

  // Função para obter iniciais do nome
  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Detalhes do Contato
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar e Nome */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={photo}
                alt={nome}
                className="object-cover"
              />
              <AvatarFallback className="text-lg font-semibold bg-primary/10">
                {getInitials(nome)}
              </AvatarFallback>
            </Avatar>

            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground">
                {nome}
              </h3>
            </div>
          </div>

          {/* Informações do Contato */}
          <div className="space-y-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <p className="text-sm text-foreground">
                      {telefone}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${!is_deleted
                    ? 'bg-emerald-100 dark:bg-emerald-900'
                    : 'bg-red-100 dark:bg-red-900'
                    }`}>
                    {!is_deleted ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p className={`text-sm font-medium ${!is_deleted
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                      }`}>
                      {!is_deleted ? 'Ativo' : 'Inativo'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDetailsModal;