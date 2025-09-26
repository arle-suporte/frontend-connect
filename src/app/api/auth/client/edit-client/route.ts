import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function PUT(request: Request) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const body = await request.json();
  const {
    uuid,
    federal_registration,
    company_name,
    trade_name,
    description,
    status,
    company_type,
    contact_name,
    contact_email,
    contact_phone,
    social_responsible
  } = body;


  if (!uuid) {
    return new Response(
      JSON.stringify({
        detail: "UUID do cliente é obrigatório",
      }),
      {
        status: 400,
      }
    );
  }

  // Validações básicas - campos obrigatórios
  if (!federal_registration || !company_name || !contact_name) {
    return new Response(
      JSON.stringify({
        detail: "CNPJ, razão social e nome do contato são obrigatórios",
      }),
      {
        status: 400,
      }
    );
  }

  // Validação de email se fornecido
  if (contact_email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact_email)) {
      return new Response(
        JSON.stringify({
          detail: "Email do contato inválido",
        }),
        {
          status: 400,
        }
      );
    }
  }

  // Validação de status


  // Validação de company_type
  const validCompanyTypes = ['undefined', 'head_office', 'branch_office'];
  if (company_type && !validCompanyTypes.includes(company_type)) {
    return new Response(
      JSON.stringify({
        detail: "Tipo de empresa inválido. Use: undefined, head_office ou branch_office",
      }),
      {
        status: 400,
      }
    );
  }

  try {
    const res = await fetch(`${API_URL}/client/${uuid}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        federal_registration,
        company_name,
        trade_name: trade_name || '',
        description: description || '',
        status: status || 'undefined',
        company_type: company_type || 'undefined',
        contact_name,
        contact_email: contact_email || '',
        contact_phone: contact_phone || '',
        social_responsible: social_responsible || ''
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return new Response(
        JSON.stringify({
          detail: errorData.error?.detail || errorData.detail || "Erro ao editar cliente",
        }),
        {
          status: res.status,
        }
      );
    }

    const clientData = await res.json();
    return new Response(
      JSON.stringify({
        message: "Cliente editado com sucesso",
        success: true,
        data: clientData
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro na requisição:", error);
    return new Response(
      JSON.stringify({
        detail: "Erro interno do servidor",
      }),
      {
        status: 500,
      }
    );
  }
}