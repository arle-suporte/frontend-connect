"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Info, Users } from "lucide-react";
import { InfoIcon } from "./InfoIcon";

interface Item {
  name: string;
  total: number;
}

interface TopListCardProps {
  title: string;
  items: Item[];
  countColor?: string;
  info?: string;
}

export function TopListCard({
  title,
  items,
  countColor,
  info,
}: TopListCardProps) {
  return (
    <Card className="shadow-xl bg-card">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium text-foreground">
            {title}
          </CardTitle>
          <InfoIcon message={info ?? "Informação adicional."} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                      {item.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-foreground">{item.name}</p>
                </div>
                <span
                  className={`text-sm font-medium ${
                    countColor ?? "text-primary"
                  }`}
                >
                  {item.total}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum atendimento localizado.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
