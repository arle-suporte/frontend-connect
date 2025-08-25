import React, { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Send, Paperclip, Mic, Images, Smile, Bold, Italic, Strikethrough } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import EmojiPicker from 'emoji-picker-react';
import { useAudioRecorder } from "@/hooks/use-audio";


interface ChatInputProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  onSendMessage: () => void;
  onSendFileMessage: (file: File) => void;
  onSendMediaMessage: (file: File) => void;
  onSendAudioMessage: (file: File) => void;
}


const ChatInput: React.FC<ChatInputProps> = ({
  newMessage,
  setNewMessage,
  onSendMessage,
  onSendFileMessage,
  onSendMediaMessage,
  onSendAudioMessage,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const abrirInputImagem = useCallback(() => imageInputRef.current?.click(), []);
  const abrirInputArquivo = useCallback(() => fileInputRef.current?.click(), []);
  const abrirInputAudio = useCallback(() => audioInputRef.current?.click(), []);
  const handleFileUploadFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendFileMessage(file);
      e.target.value = "";
    }
  }, [onSendFileMessage]);

  const handleFileUploadMedia = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !file.type.match(/^(image|video)\//)) {
      alert('Por favor, selecione apenas imagens ou vídeos');
      e.target.value = '';
      return;
    }
    if (file) {
      onSendMediaMessage(file);
      e.target.value = "";
    }
  }, [onSendMediaMessage]);

  const handleFileUploadAudio = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      onSendAudioMessage(file);
      e.target.value = "";
    }
  }, [onSendAudioMessage]);

  const handleEmojiClick = useCallback((emojiObject) => {
    setNewMessage(prevMessage => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  }, [setNewMessage]);

  // Hook de gravação
  const { recording, seconds, start, stop } = useAudioRecorder(onSendAudioMessage);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  }, [onSendMessage]);

  // Função para aplicar formatação
  const applyFormatting = useCallback((prefix: string, suffix = prefix) => {
    if (!inputRef.current) return;

    const textarea = inputRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newMessage.substring(start, end);

    let newText;
    if (selectedText) {
      // Se há texto selecionado, aplica a formatação
      newText = newMessage.substring(0, start) +
        prefix + selectedText + suffix +
        newMessage.substring(end);

      // Atualiza o texto
      setNewMessage(newText);

      // Reposiciona o cursor após a formatação
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
      }, 0);
    } else {
      // Se não há seleção, insere os marcadores e posiciona o cursor entre eles
      newText = newMessage.substring(0, start) +
        prefix + suffix +
        newMessage.substring(start);

      setNewMessage(newText);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + prefix.length);
      }, 0);
    }
  }, [newMessage, setNewMessage]);

  const handleBold = () => applyFormatting('*');
  const handleItalic = () => applyFormatting('_');
  const handleStrikethrough = () => applyFormatting('~');

  // Auto-resize do textarea
  const handleTextareaChange = useCallback((e) => {
    setNewMessage(e.target.value);

    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
  }, [setNewMessage]);

  return (
    <div className="flex-shrink-0 border-t border-border bg-card/80 backdrop-blur-sm p-4 relative">
      {showEmojiPicker && (
        <div className="absolute bottom-20 right-4 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <div className="flex items-end space-x-2">
        <TooltipProvider>
          {/* Botões de arquivo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={abrirInputArquivo}>
                <Paperclip className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Enviar arquivo</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={abrirInputImagem}>
                <Images className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Enviar mídia</TooltipContent>
          </Tooltip>
          <input
            type="file"
            ref={fileInputRef}
            className="sr-only"
            accept=".pdf,.doc,.docx,.zip,.rar,.txt"
            onChange={handleFileUploadFile}
          />
          <input
            type="file"
            ref={imageInputRef}
            className="sr-only"
            accept="image/* video/*"
            onChange={handleFileUploadMedia}
          />
          <input
            type="file"
            ref={audioInputRef}
            className="sr-only"
            accept="audio/*"
            capture="microphone"
            onChange={handleFileUploadAudio}
          />
        </TooltipProvider>

        {/* Área principal do input */}
        <div className="flex-1">
          {/* Barra de formatação */}
          <div className="flex items-center space-x-1 mb-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBold}
                    className="h-7 w-7 p-0"
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
                    onClick={handleItalic}
                    className="h-7 w-7 p-0"
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
                    onClick={handleStrikethrough}
                    className="h-7 w-7 p-0"
                  >
                    <Strikethrough className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Riscado</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Container do textarea */}
          <div className="relative">
            <Textarea
              ref={inputRef}
              value={newMessage}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Digite uma mensagem..."
              className="pr-20 resize-none max-w-screen break-words overflow-x-hidden min-h-[50px] max-h-32"
              rows={2}
            />

            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                      <Smile className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Enviar emoji</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={recording ? stop : start}
                      onContextMenu={(e) => { e.preventDefault(); abrirInputAudio(); }}
                    >
                      <Mic className={`h-4 w-4 ${recording ? 'text-red-500' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {recording ? `Gravando... ${seconds}s (clique para parar)` : "Enviar áudio"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Botão enviar */}
        <Button
          onClick={onSendMessage}
          disabled={!newMessage.trim()}
          className="bg-primary cursor-pointer self-end mb-1"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;