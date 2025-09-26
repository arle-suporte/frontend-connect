import { authenticatedFetch } from "@/lib/api-client";
import { toast } from "sonner";

export async function createClient(
  federal_registration: string,
  company_name: string,
  trade_name: string,
  description: string,
  status: string,
  company_type: string,
  contact_name: string,
  contact_email: string,
  contact_phone: string,
  social_responsible: string
) {
  const response = await authenticatedFetch('/auth/client/create-client', {
    method: 'POST',
    body: JSON.stringify({
      federal_registration: federal_registration,
      company_name: company_name,
      trade_name: trade_name,
      description: description,
      status: status,
      company_type: company_type,
      contact_name: contact_name,
      contact_email: contact_email,
      contact_phone: contact_phone,
      social_responsible: social_responsible
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao criar cliente.');
  }

  toast.success('Cliente criado com sucesso!');
  return await response.json();
};