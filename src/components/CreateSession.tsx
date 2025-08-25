import { useState } from "react";
import { Button } from "./ui/button";
import { X, Loader2 } from "lucide-react";
import { authenticatedFetch } from "@/lib/api-client";
import { API_IP } from "@/lib/constants";

export default function CreateSession() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreateSession = async () => {
    setError("");
    setLoading(true);

    try {
      // 1. Cria a sessão
      const response = await authenticatedFetch("/whatsapp/create-session/", {
        method: "POST",
      });

      if (response.ok) {
        // 2. Busca a imagem do QR code
        const qrResponse = await fetch(
          `${API_IP}/api/arle/auth/qr?format=image`
        );

        if (qrResponse.ok) {
          // 3. Converte a imagem para blob e cria URL temporária
          const imageBlob = await qrResponse.blob();
          const qrUrl = URL.createObjectURL(imageBlob);

          setQrCodeUrl(qrUrl);
          setLoading(false);
          openModal();
        } else {
          setLoading(false);
          setError("Erro ao carregar QR Code");
        }
      } else {
        setLoading(false);
        const data = await response.json();
        setError(data.detail || "Erro ao criar sessão");
      }
    } catch (err) {
      setLoading(false);
      setError("Erro de conexão");
      console.error("Error:", err);
    }
  };

  return (
    <>
      {/* Seção centralizada com título e botão */}
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-semibold text-foreground mb-6 leading-relaxed">
            Configure o número do celular por meio do botão abaixo
          </h2>

          {/* Exibir erro se houver */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <Button
            variant="default"
            onClick={handleCreateSession}
            disabled={loading}
            className="px-8 py-3 text-lg font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              "Criar sessão"
            )}
          </Button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
            {/* Botão fechar */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Conteúdo do modal */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Escaneie o QR Code
              </h2>

              {/* Container do QR Code */}
              <div className="bg-gray-100 rounded-lg p-8 mb-6">
                <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code WhatsApp"
                      className="w-full h-full object-contain rounded-lg"
                      onError={() => setError("Erro ao carregar QR Code")}
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Carregando QR...
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-600 mb-4">
                Use seu celular para escanear o código QR e entrar na sessão
              </p>

              {/* Botão secundário */}
              <Button variant="outline" onClick={closeModal} className="w-full">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
