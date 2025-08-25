import React, { useState, useEffect } from 'react';
import { UserPen, Phone, Save, Loader2, ClipboardPen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { editContact } from '@/services/contact/edit-contact';


interface editContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactData: any
  onContactUpdated: () => void;
}

const EditContactModal: React.FC<editContactModalProps> = ({
  isOpen,
  onClose,
  contactData,
  onContactUpdated
}) => {
  const [formData, setFormData] = useState({
    uuid: '',
    nome: '',
    telefone: '',
    cliente: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Preenche o formulário quando o modal abre com dados do contato
  useEffect(() => {
    if (isOpen && contactData) {
      console.log(contactData)
      setFormData({
        uuid: contactData.id || '',
        nome: contactData.nome || '',
        telefone: contactData.telefone || '',
        cliente: contactData.cliente || '',
      });
      setError('');
      setSuccess(false);
    }
  }, [isOpen, contactData]);

  // Limpa o formulário quando o modal fecha
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        uuid: '',
        nome: '',
        telefone: '',
        cliente: ''
      });
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  const handleInputChange = (field: any, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpa erro quando usuário começa a digitar
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      setError('Nome é obrigatório');
      return false;
    }
    if (!formData.telefone.trim()) {
      setError('Telefone é obrigatório');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      await editContact(formData.uuid, formData.nome, formData.telefone, formData.cliente);

      if (onContactUpdated) {
        onContactUpdated();
      }
      setSuccess(true);
      onClose();
    } catch (error: any) {
      setError(error.message || 'Erro ao atualizar contato. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');

    // Aplica máscara conforme o tamanho
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: { target: { value: string; }; }) => {
    const formatted = formatPhone(e.target.value);
    handleInputChange('telefone', formatted);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <UserPen className="h-5 w-5" />
            Editar Contato
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <AlertDescription className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full bg-green-500"></span>
                Contato atualizado com sucesso!
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="flex items-center gap-2">
                <UserPen className="h-4 w-4" />
                Nome *
              </Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Digite o nome completo"
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone *
              </Label>
              <Input
                id="telefone"
                type="text"
                value={formData.telefone}
                onChange={handlePhoneChange}
                placeholder="558173414321"
                disabled={isLoading}
                maxLength={15}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cliente" className="flex items-center gap-2">
                <ClipboardPen className="h-4 w-4" />
                Cliente
              </Label>
              <Select>
                <SelectTrigger id="target-user" className="w-full">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent className="w-full">
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || success}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isLoading ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditContactModal;