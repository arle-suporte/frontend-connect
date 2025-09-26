import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
  status: string;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggle,
  status,
}) => {
  return (
    <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
      {!isCollapsed && (
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-lg">Chat</h2>
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              status === "connection open"
                ? "bg-green-500"
                : status === "connecting..."
                ? "bg-yellow-500"
                : "bg-red-500"
            )}
          />
        </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="text-muted-foreground hover:text-foreground cursor-pointer"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};