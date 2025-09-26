"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ptBR } from "date-fns/locale";

interface DateRange {
  from?: Date;
  to?: Date;
}

interface DatePickerProps {
  text: string;
  value?: any;
  onChange?: (value?: DateRange) => void;
}

function normalizeRange(range?: DateRange): DateRange | undefined {
  if (!range) return undefined;

  const normalized: DateRange = {};

  if (range.from) {
    const start = new Date(range.from);
    start.setUTCHours(0, 0, 0, 0); // início do dia UTC
    normalized.from = start;
  }

  if (range.to) {
    const end = new Date(range.to);
    end.setUTCHours(23, 59, 59, 999); // fim do dia UTC
    normalized.to = end;
  }

  return normalized;
}

export function DatePicker({ text, value, onChange }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" data-empty={!value?.from}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.from ? (
            value.to ? (
              `${format(value.from, "PPP", { locale: ptBR })} - ${format(
                value.to,
                "PPP",
                { locale: ptBR }
              )}`
            ) : (
              format(value.from, "PPP", { locale: ptBR })
            )
          ) : (
            <span>{text}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          numberOfMonths={2}
          defaultMonth={new Date()}
          selected={value}
          onSelect={(range) => {
            if (onChange) onChange(range as DateRange);
          }}
          locale={ptBR}
          className="text-xs"
        />
      </PopoverContent>
    </Popover>
  );
}
