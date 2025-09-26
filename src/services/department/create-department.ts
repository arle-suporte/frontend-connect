import { authenticatedFetch } from "@/lib/api-client";
import { toast } from "sonner";

export const createDepartment = async (name: string) => {
  const response = await authenticatedFetch('/auth/department/create-department', {
    method: 'POST',
    body: JSON.stringify({
      name: name,
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao criar departamento.');
  }

  toast.success('Departamento criado com sucesso!');
  return await response.json();
};
