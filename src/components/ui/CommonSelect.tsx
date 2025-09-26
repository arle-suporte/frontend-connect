"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { XCircle } from "lucide-react";

interface CommonSelectProps<T> {
  getAll: (appliedFilters?: Record<string, string>) => Promise<T[]>;
  value: string | T | undefined | any
  onChange: (value: string | T | null) => void;
  valueField: keyof T;
  labelField: keyof T | (keyof T)[];
  placeholder?: string;
  separator?: string;
  searchable?: boolean;
  loadingItems?: number;
  mode?: "string" | "object"; // 🔑 novo
}

export function CommonSelect<T extends Record<string, any>>({
  getAll,
  value,
  onChange,
  valueField,
  labelField,
  placeholder = "Selecione...",
  separator = " - ",
  searchable = true,
  loadingItems = 3,
  mode = "string", // 🔑 default string para retrocompatibilidade
}: CommonSelectProps<T>) {
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getAll()
      .then((data) => {
        if (isMounted) setOptions(data);
      })
      .catch((err) => console.error("Erro ao carregar options:", err))
      .finally(() => setLoading(false));

    return () => {
      isMounted = false;
    };
  }, [getAll]);

  const getLabel = (opt?: T) => {
    if (!opt) return "";
    if (Array.isArray(labelField)) {
      return labelField
        .map((field) => String(opt[field] ?? ""))
        .filter((v) => v)
        .join(separator);
    }
    return String(opt[labelField] ?? "");
  };

  // 🔑 Se o valor for string e estamos no modo object, já converte para objeto
  // 🔑 Se o valor for string e estamos no modo object, já converte para objeto
  const selectedOption =
    mode === "object"
      ? typeof value === "string"
        ? options.find((opt) => String(opt[valueField]) === value) || null
        : (value as T | null)
      : typeof value === "string"
        ? options.find((opt) => String(opt[valueField]) === value) || null
        : (value as T | null);

  // Normaliza automaticamente caso o value inicial seja string em modo object
  useEffect(() => {
    if (mode === "object" && typeof value === "string") {
      const option = options.find((opt) => String(opt[valueField]) === value);
      if (option) {
        onChange(option); // 🔑 aqui já converte para objeto no formData
      }
    }
  }, [mode, value, options, onChange, valueField]);

  const selectedLabel = getLabel(selectedOption || undefined);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    return options.filter((opt) =>
      getLabel(opt).toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const highlightMatch = (label: string) => {
    if (!search) return label;
    const regex = new RegExp(`(${search})`, "gi");
    return label.split(regex).map((part, idx) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <strong key={idx} className="font-semibold text-foreground">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  const renderLoadingItems = () =>
    Array.from({ length: loadingItems }).map((_, idx) => (
      <SelectItem key={`loading-${idx}`} value={`loading-${idx}`} disabled>
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      </SelectItem>
    ));

  return (
    <div className="relative w-full">
      <Select
        value={selectedOption ? String(selectedOption[valueField]) : ""}
        onValueChange={(val) => {
          const option = options.find((opt) => String(opt[valueField]) === val);
          if (mode === "object") {
            onChange(option ?? null);
          } else {
            onChange(val || null); // 🔑 apenas uuid
          }
        }}
      >
        <SelectTrigger className="w-full pr-8">
          <SelectValue placeholder={placeholder}>{selectedLabel}</SelectValue>
        </SelectTrigger>

        <SelectContent className="w-full max-h-[220px] overflow-y-auto">
          {searchable && (
            <div className="p-2 sticky top-0 bg-background z-10 border-b">
              <Input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          )}

          {loading ? (
            renderLoadingItems()
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => {
              const val = String(opt[valueField]);
              const label = getLabel(opt);
              return (
                <SelectItem key={idx} value={val}>
                  {highlightMatch(label)}
                </SelectItem>
              );
            })
          ) : (
            <SelectItem value="empty" disabled>
              Nenhum item encontrado
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      {selectedOption && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-600 cursor-pointer"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
