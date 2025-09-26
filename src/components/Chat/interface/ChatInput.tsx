"use client";

import React, { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Send,
  Paperclip,
  Mic,
  Images,
  Smile,
  Bold,
  Italic,
  Strikethrough,
  MessageSquareQuoteIcon,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import EmojiPicker from "emoji-picker-react";
import { useAudioRecorder } from "@/hooks/use-audio";
import SelectResponsesModal from "../../modal/Chat/SelectResponse";
import { useAuth } from "@/contexts/AuthContext";
import {
  createOpenInputHandler,
  createFileUploadHandler,
} from "@/utils/fileHandlers";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  onSendMessage: () => void;
  onSendFileMessage: (file: File) => void;
  onSendMediaMessage: (file: File) => void;
  onSendAudioMessage: (file: File) => void;
  wsStatus: string;
  contact: any;
  activeServiceUser: string | null;
}

const ChatInput: React.FC<ChatInputProps> = ({
  newMessage,
  setNewMessage,
  onSendMessage,
  onSendFileMessage,
  onSendMediaMessage,
  onSendAudioMessage,
  wsStatus,
  contact,
  activeServiceUser,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCannedResponsesModal, setShowCannedResponsesModal] =
    useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  if (!user) return null;

  const isContactAvailable =
    !!activeServiceUser && activeServiceUser !== user.name;

  // Handlers de input
  const abrirInputImagem = createOpenInputHandler(imageInputRef);
  const abrirInputArquivo = createOpenInputHandler(fileInputRef);
  const abrirInputAudio = createOpenInputHandler(audioInputRef);

  const handleFileUploadFile = createFileUploadHandler(
    onSendFileMessage,
    isContactAvailable
  );
  const handleFileUploadMedia = createFileUploadHandler(
    onSendMediaMessage,
    isContactAvailable,
    (file) => !!file.type.match(/^(image|video)\//),
    "Por favor, selecione apenas imagens ou vídeos"
  );
  const handleFileUploadAudio = createFileUploadHandler(
    onSendAudioMessage,
    isContactAvailable,
    (file) => file.type.startsWith("audio/")
  );

  // Hook de gravação de áudio (ajustado para confirmação)
  const {
    recording,
    seconds,
    start,
    stop,
    file: audioFile,
    reset,
  } = useAudioRecorder();

  const [showAudioConfirm, setShowAudioConfirm] = useState(false);

  const handleRecordingAction = () => {
    if (isContactAvailable) return;

    if (!recording) {
      start();
      setShowAudioConfirm(false);
    } else {
      stop();
      setShowAudioConfirm(true);
    }
  };

  const handleSendAudio = () => {
    if (audioFile) {
      onSendAudioMessage(audioFile);
    }
    reset();
    setShowAudioConfirm(false);
  };

  const handleDiscardAudio = () => {
    reset();
    setShowAudioConfirm(false);
  };

  const handleEmojiClick = useCallback(
    (emojiObject: any) => {
      if (isContactAvailable) return;
      setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
      setShowEmojiPicker(false);
      inputRef.current?.focus();
    },
    [setNewMessage, isContactAvailable]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (isContactAvailable) return;
      if (e.key === "Enter" && !e.shiftKey && wsStatus === "connection open") {
        e.preventDefault();
        onSendMessage();
      }
    },
    [onSendMessage, isContactAvailable, wsStatus]
  );

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (isContactAvailable) return;
      setNewMessage(e.target.value);
      e.target.style.height = "auto";
      e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
    },
    [setNewMessage, isContactAvailable]
  );

  const handleSendMessage = useCallback(() => {
    if (isContactAvailable) return;
    onSendMessage();
  }, [onSendMessage, isContactAvailable]);

  return (
    <div className="p-2 border-t bg-background">
      {showEmojiPicker && !isContactAvailable && (
        <div className="mb-2">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <SelectResponsesModal
        open={showCannedResponsesModal && !isContactAvailable}
        onOpenChange={(open) =>
          !isContactAvailable && setShowCannedResponsesModal(open)
        }
        onSelectResponse={(desc) => setNewMessage(desc)}
      />

      {/* Container principal: 2 blocos lado a lado, em mobile ficam empilhados */}
      <div
        className={`flex flex-col sm:flex-row gap-2 ${isContactAvailable ? "opacity-50 pointer-events-none" : ""
          }`}
      >
        {/* DIV 1 - Botões de ação */}
        <div className="flex flex-wrap items-center gap-1">
          <TooltipProvider>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 w-full h-auto">
              <div className="flex items-center gap-1 bg-muted-foreground/10 rounded-md">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={abrirInputArquivo}
                      disabled={isContactAvailable}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Enviar arquivo</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={abrirInputImagem}
                      disabled={isContactAvailable}
                    >
                      <Images className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Enviar mídia</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowCannedResponsesModal(true)}
                      disabled={isContactAvailable}
                    >
                      <MessageSquareQuoteIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Respostas padrão</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRecordingAction}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          abrirInputAudio();
                        }}
                        disabled={isContactAvailable}
                      >
                        <Mic
                          className={`h-4 w-4 ${recording ? "text-red-500" : ""
                            }`}
                        />
                      </Button>

                      {/* Menu de confirmação aparece acima do botão */}
                      {showAudioConfirm && (
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-popover border rounded-md shadow-md p-2 flex gap-2 z-50">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDiscardAudio}
                          >
                            Excluir
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSendAudio}
                          >
                            Enviar
                          </Button>
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {recording
                      ? `Gravando... ${seconds}s (clique para parar)`
                      : "Enviar áudio"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-1 bg-muted-foreground/10 rounded-md">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const start = "*";
                        setNewMessage((prev) => start + prev + start);
                      }}
                      disabled={isContactAvailable}
                    >
                      <Bold className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Negrito</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const start = "_";
                        setNewMessage((prev) => start + prev + start);
                      }}
                      disabled={isContactAvailable}
                    >
                      <Italic className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Itálico</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const start = "~";
                        setNewMessage((prev) => start + prev + start);
                      }}
                      disabled={isContactAvailable}
                    >
                      <Strikethrough className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Riscado</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      disabled={isContactAvailable}
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Emoji</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </TooltipProvider>

          {/* Inputs escondidos */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUploadFile}
            className="hidden"
          />
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*,video/*"
            onChange={handleFileUploadMedia}
            className="hidden"
          />
          <input
            type="file"
            ref={audioInputRef}
            accept="audio/*"
            onChange={handleFileUploadAudio}
            className="hidden"
          />
        </div>

        {/* DIV 2 - Textarea + Enviar */}
        <div className="flex flex-1 flex-wrap justify-between items-center gap-2">
          <Textarea
            ref={inputRef}
            placeholder={
              isContactAvailable
                ? "Esse contato já está em atendimento com outro colaborador."
                : "Escreva sua mensagem..."
            }
            className="flex-1 min-h-[50px]"
            value={newMessage}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyPress}
            disabled={isContactAvailable}
          />

          <Button
            onClick={handleSendMessage}
            disabled={
              !newMessage.trim() ||
              wsStatus !== "connection open" ||
              isContactAvailable
            }
            className="bg-primary"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
