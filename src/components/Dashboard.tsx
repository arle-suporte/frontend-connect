"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { capitalizeWords } from "@/utils/capitalize";
import { authenticatedFetch } from "@/lib/api-client";
import { PeriodCard } from "./ui/PeriodCard";
import { WeekCard } from "./ui/WeekCard";
import { AHTCard } from "./ui/AHTCard";
import { TopListCard } from "./ui/TopListCard";

export default function Dashboard() {
  const { user, loading: loadingUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoadingData(true);
        setDataError(null);

        const res = await authenticatedFetch("/whatsapp/dashboard", {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Erro ao buscar dashboard:", err);
        setDataError("Erro ao carregar estatísticas");
      } finally {
        setLoadingData(false);
      }
    })();
  }, []);

  if (loadingUser || loadingData) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">
          Carregando dados...
        </span>
      </div>
    );
  }

  if (dataError) {
    return <div className="text-red-500 text-center">{dataError}</div>;
  }

  if (!user) {
    return <div className="text-center">Usuário não encontrado</div>;
  }

  console.log(data);

  return (
    <div className="flex-1 p-4 space-y-4 bg-background">
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-sm text-foreground">
          Olá, {capitalizeWords(user.name)}
        </span>
        <span className="text-lg">👋</span>
        <span className="text-sm text-foreground">
          Aqui está uma{" "}
          <strong className="text-primary">
            visão geral das últimas estatísticas
          </strong>
        </span>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <div className="flex gap-4">
            <WeekCard title="Atendimentos da semana" period={data.week} />
          </div>

          <PeriodCard title="Atendimentos do mês" period={data.month} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TopListCard
              title="Contatos com mais atendimentos iniciados"
              items={data.initiated_by_contact.map((c: any) => ({
                name: c.contact__name,
                total: c.total,
              }))}
              info="Top 6 contatos com mais atendimentos iniciados durante este mês."
              countColor="text-orange-500"
            />

            <TopListCard
              title="Funcionários com mais atendimentos concluídos"
              items={data.finalized_by_user.map((u: any) => ({
                name: u.user__name,
                total: u.total,
              }))}
              info="Top 6 funcionários com mais atendimentos concluídos durante este mês."
              countColor="text-emerald-500"
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <AHTCard month={data.month.aht} week={data.week.aht} />
        </div>
      </div>
    </div>
  );
}
