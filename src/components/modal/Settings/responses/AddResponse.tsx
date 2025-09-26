import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { createResponse } from "@/services/setting/response/create-response";


interface AddResponseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryTitle: string; 
  categoryUuid: string; 
  onAddResponse: () => void;
}

export function AddResponseModal({ open, onOpenChange, categoryTitle, categoryUuid, onAddResponse }: AddResponseModalProps) {
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = async () => {
    if (subtitle.trim() && description.trim()) {
      try {

        await createResponse(subtitle, description, categoryUuid);

        onAddResponse(); // Notifica o componente pai

        // Limpa os campos e fecha o modal
        setSubtitle("");
        setDescription("");
        onOpenChange(false);

      } catch (err) {
        console.error("Erro ao criar resposta:", err);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar resposta em {categoryTitle}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Input
            placeholder="Título da resposta"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
          <Textarea
            placeholder="Escreva o texto da resposta..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[150px] resize-none"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}