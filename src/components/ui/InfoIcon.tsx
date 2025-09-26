"use client";

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface InfoIconProps {
  message: string;
  size?: number;
}

export function InfoIcon({ message, size = 16 }: InfoIconProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info size={size} className="text-muted-foreground cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-xs text-black">{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
