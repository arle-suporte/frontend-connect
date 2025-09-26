import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { createCategory } from "@/services/setting/category/create-category";
import { toast } from "sonner";

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCategory: (title: string) => void;
}

export function AddCategoryModal({ open, onOpenChange, onAddCategory }: AddCategoryModalProps) {
  const [title, setTitle] = useState("");

  const handleSave = async () => {
    if (title.trim()) {
      try {
        await createCategory(title);
        onAddCategory(title); 
        onOpenChange(false); 
        setTitle(""); 
      } catch (err) {
        toast.error("Erro ao criar categoria");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Categoria</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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