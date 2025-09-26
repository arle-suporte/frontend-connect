"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, X } from "lucide-react";
import { useId } from "react";

interface AvatarUploaderProps {
  avatar: File | null | string;
  currentAvatar?: string;
  onChange: (file: File | null) => void;
  onRemove?: () => void;
  size?: "sm" | "md" | "lg";
}

export function AvatarUploader({
  avatar,
  currentAvatar,
  onChange,
  onRemove,
  size = "lg",
}: AvatarUploaderProps) {
  const inputId = useId();

  const dimensions = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-24 w-24",
  }[size];

  const renderImage = () => {
    if (avatar instanceof File) {
      return <AvatarImage src={URL.createObjectURL(avatar)} alt="Preview" />;
    }
    if (typeof avatar === "string" && avatar) {
      return <AvatarImage src={avatar || "?"} alt="Avatar atual" />;
    }
    if (currentAvatar) {
      return <AvatarImage src={currentAvatar || "?"} alt="Avatar atual" />;
    }
    return (
      <AvatarFallback>
        <User className="h-6 w-6 text-muted-foreground" />
      </AvatarFallback>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Avatar className={`${dimensions} border shadow`}>
          {renderImage()}
        </Avatar>

        {/* Botão remover */}
        {(avatar || currentAvatar) && onRemove && (
          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={onRemove}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-1"
          >
            <X className="h-3 w-3" />
          </Button>
        )}

        {/* Overlay de troca */}
        <Label
          htmlFor={inputId}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition cursor-pointer"
        >
          <span className="text-xs text-white font-medium">
            {avatar || currentAvatar ? "Trocar" : "Adicionar"}
          </span>
        </Label>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange(file);
          }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {avatar || currentAvatar
          ? "Clique na foto para trocar ou remova"
          : "Adicione uma foto de perfil"}
      </p>
    </div>
  );
}
