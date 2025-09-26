export function getInitials(name?: string | null): string {
  if (!name) return "N/A";
  return name.trim().charAt(0).toUpperCase();
}
