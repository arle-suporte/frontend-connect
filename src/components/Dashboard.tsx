'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Info, Users, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { capitalizeWords } from '@/utils/capitalize';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex align-baseline justify-center"><Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" /> </div>;
  if (!user) return <div>Usuário não encontrado</div>;

  const topContacts = [
    { name: 'Isabelle - EBS Comercio e Se...', initials: 'I', count: 10 },
    { name: 'Leonardo Farias - BEGGIN B...', initials: 'LF', count: 10 },
    { name: 'Nilton Castro TONPEL', initials: 'NC', count: 10 },
  ];

  const topEmployees = [
    { name: 'Fiscal Equipe 10', initials: 'FE', count: 147 },
    { name: 'Emanuella Silva', initials: 'ES', count: 84 },
    { name: 'INCORPORAÇÃO', initials: 'I', count: 82 },
  ];

  return (
    <div className="flex-1 p-4 space-y-4 bg-background" >
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-sm text-foreground">
          Olá, {capitalizeWords(user.name)}
        </span>
        <span className="text-lg">👋</span>
        <span className="text-sm text-foreground">Aqui está uma <strong className='text-primary'>visão geral das últimas estatísticas</strong></span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Card ajustado para não ocupar toda a largura */}
          <div className="flex gap-4">
            <Card className="shadow-xl bg-card object-contain w-full">
              <CardHeader className="pb-1">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-sm font-medium text-foreground">
                    Atendimentos da semana atual
                  </CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex space-x-4">
                  <div className="text-center">
                    <div className="bg-primary text-white px-3 py-1 rounded text-sm font-medium">
                      105 Iniciados
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Semana anterior</p>
                    <p className="text-sm font-medium text-foreground">609</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-emerald-800 text-white px-3 py-1 rounded text-sm font-medium">
                      82 Concluídos
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Semana anterior</p>
                    <p className="text-sm font-medium text-foreground">597</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">
                      03 Desconsiderados
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Semana anterior</p>
                    <p className="text-sm font-medium text-foreground">13</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* <Image
              src='/arte_dashboard.svg'
              width={220}
              height={200}
              alt='Arte dashboard'
              className='ml-4'
            /> */}
          </div>

          {/* Atendimentos do mês atual */}
          <Card className="shadow-lg bg-card">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Atendimentos do mês atual
                </CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-4">
                <div className="border-l-4 border-border pl-3">
                  <p className="text-xs text-muted-foreground">Iniciados</p>
                  <p className="text-xl font-bold text-primary">1218</p>
                  <p className="text-xs text-muted-foreground">2383 Mês anterior</p>
                </div>
                <div className="border-l-4 border-border pl-3">
                  <p className="text-xs text-muted-foreground">Concluídos</p>
                  <p className="text-xl font-bold text-emerald-500">1186</p>
                  <p className="text-xs text-muted-foreground">2372 Mês anterior</p>
                </div>
                <div className="border-l-4 border-border pl-3">
                  <p className="text-xs text-muted-foreground">Desconsiderados</p>
                  <p className="text-xl font-bold text-red-600">25</p>
                  <p className="text-xs text-muted-foreground">56 Mês anterior</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom row - Contatos e Funcionários */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contatos com mais atendimentos iniciados */}
            <Card className="shadow-xl bg-card">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-medium text-foreground">
                    Contatos com mais atendimentos iniciados
                  </CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {topContacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                            {contact.initials}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm text-foreground">{contact.name}</p>
                      </div>
                      <span className="text-sm font-medium text-orange-500">{contact.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Funcionários com mais atendimentos concluídos */}
            <Card className="shadow-xl bg-card">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-medium text-foreground">
                    Funcionários com mais atendimentos concluídos
                  </CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {topEmployees.map((employee, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                            {employee.initials}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm text-foreground">{employee.name}</p>
                      </div>
                      <span className="text-sm font-medium text-emerald-500">{employee.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right column - Tempo médio */}
        <div className="lg:col-span-1">
          <Card className="shadow-xl bg-card h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Tempo médio
                </CardTitle>
                <Info className="h-4 w-4 text-foreground" />
              </div>
              <div className="flex items-center justify-center text-base font-semibold gap-2">
                <Clock className='w-5 h-5 text-primary' />
                <span className="text-foreground">Atendimentos</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex flex-col items-center justify-center">
              {/* Círculo de progresso principal */}
              <div className="relative w-32 h-32 mb-6">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="8"
                    strokeDasharray="283" strokeDashoffset="0" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-primary">8h 10m</span>
                  <span className="text-xs text-foreground">Mês atual</span>
                </div>
              </div>

              <div className="w-full max-w-xs space-y-1">
                {/* Seção de Comparação Mensal */}
                <div className="bg-muted-background p-4 rounded-lg shadow-xl">
                  <h4 className="text-sm font-semibold text-primary mb-2">Comparação Mensal</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">Mês anterior</span>
                    <span className="font-medium text-foreground">9h 5m</span>
                  </div>
                </div>

                <Separator />

                {/* Seção de Dados Semanais */}
                <div className="bg-muted-background p-4 shadow-xl rounded-lg">
                  <h4 className="text-sm font-semibold text-primary mb-2">Dados Semanais</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">Semana 1</span>
                      <span className="font-medium text-foreground">1d 2h</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">Semana 2</span>
                      <span className="font-medium text-foreground">8h 15m</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">Semana 3</span>
                      <span className="font-medium text-foreground">12h 56m</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">Semana 4</span>
                      <span className="font-medium text-foreground">5h 8m</span>
                    </div>
                  </div>
                </div>
                <Separator />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;