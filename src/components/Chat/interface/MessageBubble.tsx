import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types/chat";
import { formatTime } from "@/utils/time";
import { formatMessageText } from "@/utils/format-message";
import Image from "next/image";
import { getInitials } from "@/utils/text";

export const MessageBubble: React.FC<{
  message: Message;
  contactName: string;
  contactPicture?: string;
  service: any;
}> = React.memo(({ message, contactName, contactPicture, service }) => {
  const mediaUrl = useMemo(() => {
    if (!message.has_media || !message.media_file) return undefined;
    return message.media_file;
  }, [message.has_media, message.media_file]);

  const formattedText = useMemo(() => {
    return formatMessageText(message.text);
  }, [message.text]); // Formatando o texto para negrito, itálico, riscado e quebras de linha.

  const renderMedia = useMemo(() => {
    if (!message.has_media || !message.media_file || !message.media_type)
      return null;
    if (!mediaUrl || !message.media_type) {
      return null;
    }

    const type = message.media_type;

    const imageTypes = ["image/jpeg", "image/png", "image/webp"];

    if (imageTypes.includes(type)) {
      return (
        <Image
          src={mediaUrl}
          alt="Mídia"
          className="rounded-md"
          width={250}
          height={250}
        />
      );
    }

    if (type === "video/mp4") {
      return (
        <video controls className="max-w-[300px] max-h-[300px] rounded-md">
          <source src={mediaUrl} type={type} />
          Seu navegador não suporta a tag de vídeo.
        </video>
      );
    }

    const audioTypes = ["audio/ogg; codecs=opus", "audio/ogg", "audio/webm"];

    if (audioTypes.includes(type)) {
      return (
        <audio controls className="w-[300px]">
          <source src={mediaUrl} type={type} />
          Seu navegador não suporta a tag de áudio.
        </audio>
      );
    }

    if (type === "application/pdf") {
      return (
        <a
          href={mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          <Button
            variant={"ghost"}
            className="h-auto p-2 w-full justify-center align-self-center gap-2"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span className="truncate max-w-[200px] font-medium">
              {message.file_name || "Visualizar PDF"}
            </span>
          </Button>
        </a>
      );
    }

    return (
      <a href={mediaUrl} download className="flex items-center">
        <Button
          variant={"ghost"}
          className="h-auto p-2 w-full justify-center align-self-center gap-2"
        >
          <Download className="h-4 w-4 shrink-0" />
          <span className="truncate max-w-[200px] font-medium">
            {message.file_name}
          </span>
        </Button>
      </a>
    );
  }, [
    message.has_media,
    message.media_file,
    message.media_type,
    message.text,
    mediaUrl,
  ]);

  return (
    <div
      className={cn(
        "flex mb-4 z-0",
        message.from_me ? "justify-end" : "justify-start"
      )}
    >
      {!message.from_me && (
        <Avatar className="h-8 w-8 mr-2 mt-1">
          <AvatarImage src={contactPicture || "?"} alt={contactName} />
          <AvatarFallback className="bg-primary text-white text-xs">
            {getInitials(contactName)}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-xl",
          message.from_me
            ? "bg-primary/70 text-white"
            : "bg-background/50 text-foreground"
        )}
      >
        <p
          className="text-sm mt-1"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
        {message.has_media && message.media_file && (
          <div className="mt-2">{renderMedia}</div>
        )}
        <div className="flex items-center justify-end text-xs">
          <span>{formatTime(message.timestamp)}</span>
        </div>
      </div>
      {message.from_me && (
        <Avatar className="h-8 w-8 ml-2 mt-1">
          <AvatarFallback className="bg-primary text-white text-xs">
            {service.user?.charAt(0).toUpperCase() || "Você"}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
});
