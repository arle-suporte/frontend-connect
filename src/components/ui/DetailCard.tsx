import { Card, CardContent } from "@/components/ui/card";
import React from "react";

interface DetailCardProps {
  icon: React.ReactNode;
  iconBg?: string;
  label: string;
  value: string | React.ReactNode;
}

export const DetailCard = ({
  icon,
  iconBg = "bg-primary/10",
  label,
  value,
}: DetailCardProps) => {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-1">
        <div className="flex flex-col items-center text-center space-y-2">
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full ${iconBg}`}
          >
            {icon}
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {label}
            </p>
            <p className="text-sm font-semibold text-foreground mt-1">
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
