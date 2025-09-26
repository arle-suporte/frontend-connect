import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  inProgressCount: number;
  pendingCount: number;
  isDisabled: boolean;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  inProgressCount,
  pendingCount,
  isDisabled,
}) => {
  return (
    <div className="flex-shrink-0 border-b border-border">
      <TabsList className="w-full justify-start rounded-xl h-auto p-0">
        <TabsTrigger
          value="in_progress"
          className="text-xs flex items-center rounded-xl gap-2"
          disabled={isDisabled}
        >
          <span>Em andamento</span>
          <Badge variant="default" className="h-4 px-1 text-xs">
            {inProgressCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger
          value="pending"
          className="text-xs flex items-center rounded-xl gap-2"
          disabled={isDisabled}
        >
          <span>Pendente</span>
          <Badge variant="destructive" className="h-4 px-1 text-xs">
            {pendingCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger
          value="groups"
          className="text-xs flex items-center rounded-xl gap-2"
          disabled={isDisabled}
        >
          <span>Grupos</span>
        </TabsTrigger>
      </TabsList>
      <TabsList className="w-full justify-start rounded-xl h-auto p-0 mt-2">
        <TabsTrigger
          value="contacts"
          className="text-xs flex items-center rounded-xl gap-2"
          disabled={isDisabled}
        >
          <span>Contatos</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};