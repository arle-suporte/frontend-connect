"use client";

import React, { useState, useEffect } from "react";
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
import { FormLabelWithIcon } from "@/components/ui/form-label-with-icon";
import { departmentSchema, DepartmentFormData } from "@/schemas/department";
import { useZodForm } from "@/hooks/useZodForm";
import { editDepartment } from "@/services/department/edit-department";

interface ManageDepartmentModalProps {
  open: boolean;
  onClose: () => void;
  departmentUuid: string;
  departmentName: string;
  onDepartmentUpdated: () => void;
}

const ManageDepartmentModal: React.FC<ManageDepartmentModalProps> = ({
  open,
  onClose,
  departmentUuid,
  departmentName,
  onDepartmentUpdated,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { formData, setField, setFormData, errors, validate } = useZodForm(
    departmentSchema,
    { name: "" } as DepartmentFormData
  );

  useEffect(() => {
    if (open) {
      setFormData({ name: departmentName || "" });
    }
  }, [open, departmentName, setFormData]);

  const handleUpdate = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await editDepartment(departmentUuid, formData.name);
      onDepartmentUpdated?.();
      onClose();
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ name: departmentName || "" });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Editar Departamento
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
          <Button onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageDepartmentModal;
