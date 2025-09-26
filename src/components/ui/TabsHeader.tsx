"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactType } from "@/types/chat";

export interface TabConfig {
  value: string;
  label: string;
  icon: React.ElementType;
  showContact?: boolean;
  disabled?: boolean;
}

interface TabsHeaderProps {
  tabs: TabConfig[];
  loading?: boolean;
  selectedContact?: ContactType | null;
  disabled?: boolean; // disabled global (mantido para compatibilidade)
}

export default function TabsHeader({
  tabs,
  loading = false,
  selectedContact = null,
  disabled = false
}: TabsHeaderProps) {
  return (
    <div className="border-b border-border px-3 py-2  min-h-[56px] flex items-center">
      <TabsList
        className="flex flex-wrap justify-center gap-x-4 gap-y-2  w-full h-auto"
        style={{ display: "flex" }} // sobrescreve inline-flex padrão do Radix
      >
        {tabs.map(({ value, label, icon: Icon, showContact, disabled: tabDisabled }) => (
          <TabsTrigger
            key={value}
            value={value}
            disabled={loading || tabDisabled} // Verifica o disabled individual da tab
            className="inline-flex items-center space-x-2 whitespace-nowrap"
          >
            <Icon className="w-5 h-5" />
            <span className="hidden sm:inline">{label}</span>
            {showContact && selectedContact && (
              <span className="hidden sm:inline text-xs text-muted-foreground truncate max-w-[120px]">
                - {" "}
                {selectedContact.name.length > 12
                  ? selectedContact.name.slice(0, 12) + "..."
                  : selectedContact.name}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}