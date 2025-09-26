"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Info, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { InfoIcon } from "./InfoIcon";

interface AHTBlock {
  current: {
    avg_human: string;
  };
  previous: {
    avg_human: string;
  };
}

interface AHTCardProps {
  month: AHTBlock;
  week: AHTBlock;
}

export function AHTCard({ month, week }: AHTCardProps) {
  return (
    <Card className="shadow-xl bg-card h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-sm font-medium text-foreground">
            Tempo médio
          </CardTitle>
          <InfoIcon message="Tempo médio de resposta de cada atendimento por período." />
        </div>
        <div className="flex items-center justify-center text-base font-semibold gap-2">
          <span className="text-foreground">Atendimentos</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex flex-col items-center justify-center">
        <div className="relative w-32 h-32 mb-6">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset="0"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {month.current.avg_human}
            </span>
            <span className="text-xs text-foreground">Mês atual</span>
          </div>
        </div>

        <div className="w-full max-w-xs space-y-1">
          <div className="bg-muted-background p-4 rounded-lg shadow-xl">
            <h4 className="text-sm font-semibold text-primary mb-2">
              Comparação Mensal
            </h4>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              Mês anterior
              <span className="font-medium text-muted-foreground">
                {month.previous.avg_human}
              </span>
            </div>
          </div>

          <Separator />

          <div className="bg-muted-background p-4 shadow-xl rounded-lg">
            <h4 className="text-sm font-semibold text-primary mb-2">
              Dados Semanais
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                Semana atual
                <span className="font-medium text-muted-foreground">
                  {week.current.avg_human}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                Semana anterior
                <span className="font-medium">{week.previous.avg_human}</span>
              </div>
            </div>
          </div>
          <Separator />
        </div>
      </CardContent>
    </Card>
  );
}
