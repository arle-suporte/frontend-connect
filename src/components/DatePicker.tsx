"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ptBR } from "date-fns/locale"

interface DatePickerProps {
  text: string
}

export function DatePicker({ text }: DatePickerProps) {
  const [date, setDate] = React.useState({
    from: undefined,
    to: undefined
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          data-empty={!date}
        >
          <CalendarIcon />
          {date?.from ? (
            date.to ? (
              // Range completo selecionado
              `${format(date.from, "PPP", { locale: ptBR })} - ${format(date.to, "PPP", { locale: ptBR })}`
            ) : (
              // Apenas data inicial selecionada
              format(date.from, "PPP", { locale: ptBR })
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
          selected={date}
          onSelect={setDate}
          locale={ptBR}
          className="text-xs"
        />
      </PopoverContent>
    </Popover>
  )
}