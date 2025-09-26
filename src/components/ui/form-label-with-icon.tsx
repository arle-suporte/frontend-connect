"use client";

import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { DialogTitle } from "./dialog";

interface FormLabelWithIconProps {
  htmlFor: string;
  icon: ReactNode;
  text: string;
  required?: boolean;
}

export function FormLabelWithIcon({
  htmlFor,
  icon,
  text,
  required = false,
}: FormLabelWithIconProps) {
  return (
    <DialogTitle>
      <Label htmlFor={htmlFor} className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/30">
          {icon}
        </div>
        {text} {required && <span className="text-red-500 font-medium">*</span>}
      </Label>
    </DialogTitle>
  );
}
