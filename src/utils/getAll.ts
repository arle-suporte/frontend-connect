import { getCommon } from "@/services/common/get-common";
import {
  ClientCommonType,
  CommonType,
  CustomerCommonType,
} from "@/types/common";

export async function getAllCustomers(): Promise<CustomerCommonType[]> {
  return getCommon<CustomerCommonType>("customers");
}

export async function getAllClients(
  appliedFilters?: Record<string, string>
): Promise<ClientCommonType[]> {
  return getCommon<ClientCommonType>("client");
}

export async function getAllContacts(): Promise<CommonType[]> {
  return getCommon<CommonType>("contact");
}

export async function getAllDepartments(): Promise<CommonType[]> {
  return getCommon<CommonType>("department");
}

export async function getAllPositions(): Promise<CommonType[]> {
  return getCommon<CommonType>("position");
}
