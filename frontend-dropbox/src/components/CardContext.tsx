import { useState } from "react";
import axios from "axios";

interface CardProps {
  id: number;
  title: string;
  description: string | null;
}

function CardContext({ id, title, description }: CardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const truncateDescription = (text: string | null, maxLength: number = 60) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const handleDownload = async (id: number, filename: string) => {
    try {
      setIsDownloading(true);
      console.log("Iniciando download do arquivo:", id);

      const response = await axios.get(
        `http://localhost:3000/archives/download/${id}`,
        {
          responseType: "blob", // ⚠️ necessário para receber binário
        }
      );

      // Determina o tipo MIME correto retornado pelo backend
      const contentType = response.headers["content-type"] || "application/octet-stream";

      // Cria um Blob com o tipo correto
      const blob = new Blob([response.data], { type: contentType });

      // Cria URL temporária
      const url = window.URL.createObjectURL(blob);

      // Cria elemento <a> invisível e dispara o download
      const link = document.createElement("a");
      link.href = url;

      // Define o nome do arquivo — se não vier, usa o title
      const safeFilename = filename || `${title}.bin`;
      link.setAttribute("download", safeFilename);

      document.body.appendChild(link);
      link.click();

      // Libera memória e remove o link
      link.remove();
      window.URL.revokeObjectURL(url);

      console.log("Download concluído com sucesso!");
    } catch (err: any) {
      console.error("Erro ao baixar o arquivo:", err);
      if (err.response?.status === 404) {
        alert("Arquivo não encontrado.");
      } else {
        alert("Erro ao baixar o arquivo. Tente novamente.");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex justify-between items-start gap-4">
        {/* Título e descrição */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate" title={title}>
            {title}
          </h3>
          {description && (
            <p
              className="mt-1 text-sm text-gray-500 line-clamp-2"
              title={description}
            >
              {truncateDescription(description)}
            </p>
          )}
        </div>

        {/* Botão de Download */}
        <button
          onClick={() => handleDownload(id, title)}
          disabled={isDownloading}
          className={`shrink-0 p-2 rounded-full transition-colors duration-200 ${
            isDownloading
              ? "text-blue-400 cursor-wait"
              : isHovering
              ? "bg-blue-50 text-blue-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
          title="Baixar arquivo"
        >
          {isDownloading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default CardContext;
