import { format } from "date-fns";

type DateRange = { from?: Date; to?: Date };

export function serializeFilters(filters: Record<string, any>) {
  const serialized: Record<string, any> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (!value) continue;

    // Caso seja Date simples
    if (value instanceof Date) {
      serialized[key] = format(value, "yyyy-MM-dd");
      continue;
    }

    // Caso seja um range
    if (typeof value === "object" && ("from" in value || "to" in value)) {
      const range = value as DateRange;
      if (range.from)
        serialized[`${key}_after`] = format(range.from, "yyyy-MM-dd");
      if (range.to)
        serialized[`${key}_before`] = format(range.to, "yyyy-MM-dd");
      continue;
    }

    serialized[key] = value;
  }

  return serialized;
}
