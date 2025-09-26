"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { MessageCircle, MessageSquareText, Plus, Trash } from "lucide-react";
import { useState, useEffect } from "react";

import { AddCategoryModal } from "./AddCategory";
import { AddResponseModal } from "./AddResponse";
import DeleteResponseModal from "./DeleteResponse";
import DeleteCategoryModal from "./DeleteCategory";

import { editResponse } from "@/services/setting/response/edit-response";
import { getCategories } from "@/services/setting/category/get-categories";
import { getCategoryResponses } from "@/services/setting/response/get-responses";

interface CannedResponsesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export default function CannedResponsesModal({
  open,
  onOpenChange,
}: CannedResponsesModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);

  const [selectedCategoryUuid, setSelectedCategoryUuid] = useState("");
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] =
    useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [loadingResponses, setLoadingResponses] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedResponse, setSelectedResponse] = useState("");
  const [selectedResponseObject, setSelectedResponseObject] =
    useState<Response | null>(null);

  const [responseTitle, setResponseTitle] = useState("");
  const [responseText, setResponseText] = useState("");

  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddResponseModalOpen, setIsAddResponseModalOpen] = useState(false);

  // Estados para o modal de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [responseToDelete, setResponseToDelete] = useState<Response | null>(
    null
  );

  // Buscar categorias quando o modal abrir
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
      setError("Erro ao carregar categorias");
      console.error("Erro ao buscar categorias:", err);
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
      console.error("Erro ao buscar respostas da categoria:", err);
      setResponses([]);
    } finally {
      setLoadingResponses(false);
    }
  };

  const handleCategoryClick = async (category: Category) => {
    setSelectedCategory(category.title);
    setSelectedCategoryUuid(category.uuid);
    setSelectedResponse("");
    setResponseTitle("");
    setResponseText("");
    await fetchCategoryResponses(category.uuid);
  };

  const handleDeleteCategoryClick = () => {
    // Encontre o objeto da categoria selecionada
    const categoryObject = categories.find(
      (cat) => cat.uuid === selectedCategoryUuid
    );
    if (categoryObject) {
      setCategoryToDelete(categoryObject);
      setIsDeleteCategoryModalOpen(true);
    }
  };

  const handleDeleteCategorySuccess = () => {
    setIsDeleteCategoryModalOpen(false);
    setSelectedResponse("");
    setResponseTitle("");
    setResponseText("");
    setCategoryToDelete(null);
    fetchCategories(); // Recarrega a lista de categorias
    setSelectedCategory("");
    setSelectedCategoryUuid("");
    setResponses([]); // Limpa as respostas
  };

  const handleResponseClick = (response: Response) => {
    setSelectedResponse(response.subtitle);
    setSelectedResponseObject(response);
    setResponseTitle(response.subtitle);
    setResponseText(response.description);
  };

  // Função para abrir o modal de exclusão, definindo qual resposta será excluída
  const handleDeleteResponseClick = (response: Response) => {
    setResponseToDelete(response);
    setIsDeleteModalOpen(true);
  };

  // Função para ser chamada após a exclusão bem-sucedida
  const handleDeleteResponseSuccess = () => {
    setIsDeleteModalOpen(false);
    setResponseToDelete(null);
    fetchCategoryResponses(selectedCategoryUuid);
    setSelectedResponse("");
    setResponseTitle("");
    setResponseText("");
  };

  const handleEditResponse = async () => {
    if (!selectedResponseObject) {
      return;
    }

    try {
      // Chamar a função de edição
      await editResponse(
        selectedResponseObject.uuid,
        responseText,
        selectedCategoryUuid,
        responseTitle
      );

      // Após a edição, recarregar as respostas para mostrar a alteração
      await fetchCategoryResponses(selectedCategoryUuid);

      // Limpar os campos de edição e o estado da resposta selecionada
      setSelectedResponse("");
      setSelectedResponseObject(null);
      setResponseTitle("");
      setResponseText("");
    } catch (err) {
      console.error("Erro ao salvar a resposta:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="xl:max-w-6xl w-full max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-3">
          <DialogTitle className="text-lg font-semibold">
            Modelos de mensagens
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-1">
          <div className="space-y-4 py-4">
            <div className="flex gap-6 h-[600px]">
              {/* Lado esquerdo - Categorias e Respostas */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Categorias</h3>
                  <Button
                    variant={"ghost"}
                    onClick={() => setIsAddCategoryModalOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Categoria
                  </Button>
                </div>

                {/* Categorias */}
                <div className="flex flex-wrap gap-2">
                  {loading ? (
                    <p className="text-sm text-muted-foreground">
                      Carregando categorias...
                    </p>
                  ) : error ? (
                    <p className="text-sm text-red-500">{error}</p>
                  ) : categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma categoria encontrada
                    </p>
                  ) : (
                    categories.map((category) => (
                      <Badge
                        key={category.uuid}
                        variant={
                          selectedCategory === category.title
                            ? "secondary"
                            : "outline"
                        }
                        className={`cursor-pointer px-3 py-1 text-xs ${
                          selectedCategory === category.title
                            ? "bg-secondary text-foreground"
                            : "hover:bg-secondary"
                        }`}
                        onClick={() => handleCategoryClick(category)}
                      >
                        {category.title}
                      </Badge>
                    ))
                  )}
                </div>

                {/* Lista de Respostas da Categoria Selecionada */}
                {selectedCategory && (
                  <div className="border rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-medium text-sm">
                        {selectedCategory}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAddResponseModalOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                        Adicionar mensagem
                      </Button>
                    </div>

                    {loadingResponses ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Carregando respostas...
                      </p>
                    ) : responses.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Nenhuma resposta cadastrada para esta categoria
                      </p>
                    ) : (
                      responses.map((response) => (
                        <div
                          key={response.uuid}
                          className={`p-3 rounded border cursor-pointer transition-colors flex justify-between items-center ${
                            selectedResponse === response.subtitle
                              ? "bg-primary/10 border-primary"
                              : "hover:bg-secondary"
                          }`}
                          onClick={() => handleResponseClick(response)}
                        >
                          <div>
                            <div className="font-medium text-sm">
                              {response.subtitle}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 truncate">
                              {response.description}
                            </div>
                          </div>
                          <span className="ml-4">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={"ghost"}
                                    className="flex justify-center"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteResponseClick(response);
                                    }}
                                  >
                                    <Trash className="text-destructive h-5 w-6" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Excluir resposta
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Lado direito - Editor de Resposta */}
              <div className="flex-1 border-l pl-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Editar resposta</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder="Título da resposta..."
                        value={responseTitle}
                        onChange={(e) => setResponseTitle(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Textarea
                        placeholder="Escreva o texto da resposta..."
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        className="min-h-[300px] resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 justify-between">
                    <div className="flex gap-4">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSelectedResponse("");
                          setResponseTitle("");
                          setResponseText("");
                          setSelectedResponseObject(null);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant={"default"}
                        onClick={handleEditResponse}
                        disabled={!selectedResponseObject}
                      >
                        Salvar
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant={"destructive"}
                        onClick={handleDeleteCategoryClick}
                        disabled={!selectedCategoryUuid}
                      >
                        Excluir categoria
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <AddCategoryModal
        open={isAddCategoryModalOpen}
        onOpenChange={setIsAddCategoryModalOpen}
        onAddCategory={() => {
          setIsAddCategoryModalOpen(false);
          fetchCategories();
        }}
      />
      <AddResponseModal
        open={isAddResponseModalOpen}
        onOpenChange={setIsAddResponseModalOpen}
        categoryTitle={selectedCategory}
        categoryUuid={selectedCategoryUuid}
        onAddResponse={() => {
          fetchCategoryResponses(selectedCategoryUuid);
        }}
      />

      {responseToDelete && (
        <DeleteResponseModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          responseUuid={responseToDelete.uuid}
          responseSubtitle={responseToDelete.subtitle}
          onSuccess={handleDeleteResponseSuccess}
        />
      )}

      {categoryToDelete && (
        <DeleteCategoryModal
          open={isDeleteCategoryModalOpen}
          onClose={() => setIsDeleteCategoryModalOpen(false)}
          categoryUuid={categoryToDelete.uuid}
          categoryTitle={categoryToDelete.title}
          onSuccess={handleDeleteCategorySuccess}
        />
      )}
    </Dialog>
  );
}
