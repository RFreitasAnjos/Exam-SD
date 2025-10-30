import { useState, useEffect } from 'react';
import axios from 'axios';
import CardContext from './CardContext';

interface File {
  id: number;
  title: string;
  description: string | null;
  path: string;
  filename: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

function Content() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      console.log('Iniciando busca de arquivos...');
      const response = await axios.get('http://localhost:3000/archives');
      console.log('Resposta completa:', response);
      console.log('Status:', response.status);
      console.log('Dados recebidos:', response.data);
      
      if (Array.isArray(response.data)) {
        setFiles(response.data);
        console.log('Arquivos atualizados no estado:', response.data.length, 'arquivos');
      } else {
        console.error('Dados recebidos não são um array:', response.data);
        setError('Formato de dados inválido recebido do servidor');
      }
      setError(null);
    } catch (err: any) {
      console.error('Erro detalhado:', err);
      console.error('Mensagem de erro:', err.message);
      if (err.response) {
        console.error('Resposta de erro:', err.response.data);
        console.error('Status:', err.response.status);
      }
      setError('Erro ao carregar os arquivos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: number) => {
  try {
    console.log('Iniciando download do arquivo:', id);
    const response = await axios.get(`http://localhost:3000/archives/${id}`, {
      responseType: 'arraybuffer', // arraybuffer evita problemas de encodificação
    });
    console.log('Download concluído:', response);

    // obter content-type e content-disposition
    const contentType = response.headers['content-type'] || 'application/octet-stream';
    const contentDisposition = response.headers['content-disposition'];
    let filename = `arquivo-${id}.bin`;

    if (contentDisposition) {
      const match = /filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/i.exec(contentDisposition);
      if (match && match[1]) {
        filename = decodeURIComponent(match[1]);
      } else {
        // fallback quando houver filename="nome.ext"
        const fallback = /filename="?([^"]+)"?/.exec(contentDisposition);
        if (fallback && fallback[1]) filename = fallback[1];
      }
    }

    const blob = new Blob([response.data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error downloading file:', err);
    alert('Erro ao baixar o arquivo. Tente novamente mais tarde.');
  }
};

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-6 bg-red-50 rounded-xl shadow-sm">
          <svg
            className="mx-auto h-12 w-12 text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-lg font-medium">{error}</p>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center text-gray-500 min-h-[400px] flex flex-col items-center justify-center p-8">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-xl font-medium mb-2">Nenhum arquivo encontrado</h3>
          <p className="text-gray-600">Envie seu primeiro arquivo para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {files.map((file) => {
            console.log('Renderizando arquivo:', file); // Debug de cada arquivo
            return (
              <CardContext
                key={file.id}
                id={file.id}
                title={file.title || 'Sem título'} // Fallback para título vazio
                description={file.description || ''} // Fallback para descrição vazia
                onDownload={handleDownload}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Content;