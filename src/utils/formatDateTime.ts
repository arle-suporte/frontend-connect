/**
 * Formata uma string de data ISO em "dd/MM/yyyy às HH:mm:ss"
 *
 * @param isoString - ex: "2025-09-10T17:37:58.700724-03:00"
 * @returns string formatada ou "-" se inválida
 */
export function formatDateTime(isoString?: string | null): string {
  if (!isoString) return "-";

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "-";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} às ${hours}:${minutes}:${seconds}`;
}
