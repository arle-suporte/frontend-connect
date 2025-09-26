"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PeriodCardProps } from "@/types/dashboard";
import { getStatusKeys } from "@/utils/status-keys";
import { InfoIcon } from "./InfoIcon";

export function PeriodCard({ title, period }: PeriodCardProps) {
  const status_keys = getStatusKeys();
  return (
    <Card className="shadow-lg bg-card">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <CardTitle className="text-sm font-medium text-foreground">
            {title} ({period.current.label})
          </CardTitle>
          <InfoIcon message="Quantidade de atendimentos abertos, finalizados, etc. durante este mês." />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {status_keys.map(({ key, label, color }) => {
            const cur = period.current.counts[key] ?? 0;
            const prv = period.previous.counts[key] ?? 0;
            const metric = period.metrics[key];

            return (
              <div key={key} className="border-l-4 border-border pl-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-xl font-bold text-${color}`}>{cur}</p>
                <p className="text-xs text-muted-foreground">
                  {prv} <span className="ms-1">{period.previous.label}</span>
                  <span
                    className={`ms-1 text-xs font-medium ${metric.color === "green"
                      ? "text-green-600"
                      : metric.color === "red"
                        ? "text-red-600"
                        : "text-muted-foreground"
                      }`}
                  >
                    {metric.icon} {metric.delta_abs}{" "}
                    {metric.delta_pct !== null ? `${metric.delta_pct}%` : ""}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
