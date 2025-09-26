const statusMap: Record<string, string> = {
  undefined: "Indefinido",
  client: "Cliente",
  former_client: "Ex-cliente",
};

export function getStatus(value?: string | null): string {
  if (!value) return statusMap["undefined"];
  return statusMap[value] ?? statusMap["undefined"];
}
