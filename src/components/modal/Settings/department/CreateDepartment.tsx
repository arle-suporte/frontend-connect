"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookUser } from "lucide-react";
import { createDepartment } from "@/services/department/create-department";
import { FormLabelWithIcon } from "@/components/ui/form-label-with-icon";
import { departmentSchema, DepartmentFormData } from "@/schemas/department";
import { useZodForm } from "@/hooks/useZodForm";

interface CreateDepartmentModalProps {
  open: boolean;
  onClose: () => void;
  onDepartmentCreated: () => void;
}

const CreateDepartmentModal: React.FC<CreateDepartmentModalProps> = ({
  open,
  onClose,
  onDepartmentCreated,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { formData, setField, errors, validate, setFormData } = useZodForm(
    departmentSchema,
    { name: "" } as DepartmentFormData
  );

  const handleCreate = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await createDepartment(formData.name);
      onDepartmentCreated?.();
      onClose();
      setFormData({ name: "" });
    } catch (e: any) {
      setFormData({ name: "" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ name: "" });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Cadastrar Departamento
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid gap-1">
            <FormLabelWithIcon
              htmlFor="name"
              icon={<BookUser className="h-4 w-4 text-primary" />}
              text="Nome"
              required
            />
            <Input
              id="name"
              placeholder="Digite o nome do departamento"
              value={formData.name}
              onChange={(e) => setField("name", e.target.value)}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={isLoading}>
            {isLoading ? "Cadastrando..." : "Cadastrar Departamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDepartmentModal;
