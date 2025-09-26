"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { WeekCardProps } from "@/types/dashboard";
import { getStatusKeys } from "@/utils/status-keys";
import { Info } from "lucide-react";
import { InfoIcon } from "./InfoIcon";

export function WeekCard({ title, period }: WeekCardProps) {
  const STATUS_KEYS = getStatusKeys();

  return (
    <Card className="shadow-xl bg-card object-contain w-full">
      <CardHeader className="pb-1">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-sm font-medium text-foreground">
            {title} ({period.current.label})
          </CardTitle>
          <InfoIcon message="Quantidade de atendimentos abertos, finalizados, etc. durante esta semana." />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-4">
          {STATUS_KEYS.map(({ key, label, color }) => {
            const cur = period.current.counts[key] ?? 0;
            const prv = period.previous.counts[key] ?? 0;

            return (
              <div key={key} className="text-center min-w-[100px]">
                <div
                  className={`bg-${color} text-white px-3 py-1 rounded text-sm font-medium`}
                >
                  {cur} {label}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Semana anterior
                </p>
                <p className="text-sm font-medium text-foreground">{prv}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
