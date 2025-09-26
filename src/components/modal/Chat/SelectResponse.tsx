import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getCategories } from "@/services/setting/category/get-categories";
import { getCategoryResponses } from "@/services/setting/response/get-responses";

// Componente usado no CHAT
interface SelectResponsesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectResponse: (description: string) => void;
}

interface Category {
  uuid: string;
  title: string;
}

interface Response {
  uuid: string;
  subtitle: string;
  description: string;
}

export default function SelectResponsesModal({
  open,
  onOpenChange,
  onSelectResponse,
}: SelectResponsesModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data.results || []);
    } catch (err) {
      setError('Erro ao carregar categorias');
      console.error('Erro ao buscar categorias:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryResponses = async (categoryUuid: string) => {
    setLoadingResponses(true);
    try {
      const data = await getCategoryResponses(categoryUuid);
      setResponses(data.results || []);
    } catch (err) {
      console.error('Erro ao buscar respostas da categoria:', err);
      setResponses([]);
    } finally {
      setLoadingResponses(false);
    }
  };

  const handleCategoryClick = async (category: Category) => {
    setSelectedCategory(category);
    await fetchCategoryResponses(category.uuid);
  };

  const handleResponseClick = (response: Response) => {
    onSelectResponse(response.description);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Respostas padrão</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          {/* Categorias */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-foreground">Selecione uma categoria:</h4>
            <div className="flex flex-wrap gap-2">
              {loading ? (
                <p className="text-sm text-foreground">Carregando categorias...</p>
              ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : categories.length === 0 ? (
                <p className="text-sm text-foreground">Nenhuma categoria encontrada</p>
              ) : (
                categories.map((category) => (
                  <Badge
                    key={category.uuid}
                    variant={selectedCategory?.uuid === category.uuid ? "secondary" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category.title}
                  </Badge>
                ))
              )}
            </div>
          </div>
          {/* Respostas da Categoria Selecionada */}
          {selectedCategory && (
            <div className="space-y-2 mt-4">
              <h4 className="font-medium text-sm text-foreground">
                Respostas para: {selectedCategory.title}
              </h4>
              <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-2">
                {loadingResponses ? (
                  <p className="text-sm text-foreground text-center">Carregando respostas...</p>
                ) : responses.length === 0 ? (
                  <p className="text-sm text-foreground text-center">
                    Nenhuma resposta para esta categoria.
                  </p>
                ) : (
                  responses.map((response) => (
                    <div
                      key={response.uuid}
                      className="p-3 rounded border cursor-pointer hover:bg-secondary transition-colors"
                      onClick={() => handleResponseClick(response)}
                    >
                      <div className="font-medium text-sm">{response.subtitle}</div>
                      <div className="text-xs text-foreground mt-1 truncate">
                        {response.description}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}