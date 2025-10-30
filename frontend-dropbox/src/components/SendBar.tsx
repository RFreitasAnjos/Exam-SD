import { useState, useCallback } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { uploadFile } from '../services/upload.service';

interface FileUploadProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

function SendBar({ onSuccess, onError }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    author: ''
  });

  const handleDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
      setMetadata(prev => ({ ...prev, title: files[0].name }));
    }
  }, []);

  const handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
      setMetadata(prev => ({ ...prev, title: files[0].name }));
    }
  }, []);

  const handleMetadataChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile || !metadata.title || !metadata.author) {
      return;
    }

    setIsUploading(true);
    try {
      await uploadFile(selectedFile, metadata);
      setSelectedFile(null);
      setMetadata({ title: '', description: '', author: '' });
      onSuccess?.();
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, metadata, onSuccess, onError]);

  return (
    <div className="w-full flex flex-col gap-6">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          min-h-[240px] w-full
          border-3 border-dashed rounded-xl
          flex flex-col items-center justify-center
          transition-all duration-300 ease-in-out
          ${isDragging
            ? 'border-blue-500 bg-blue-50 scale-[1.02]'
            : 'border-gray-300 hover:border-blue-400 hover:scale-[1.01] bg-white'
          }
        `}
      >
        <input
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="flex flex-col items-center justify-center p-6 cursor-pointer w-full h-full"
        >
          <div className="flex flex-col items-center gap-4">
            <svg
              className={`w-12 h-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className={`text-lg font-medium ${isDragging ? 'text-blue-500' : 'text-gray-700'}`}>
              {isDragging
                ? 'Solte o arquivo aqui'
                : selectedFile
                  ? `Arquivo selecionado: ${selectedFile.name}`
                  : 'Arraste e solte arquivos aqui'}
            </div>
            <p className="text-sm text-gray-500">
              ou {!selectedFile && 'clique para selecionar um arquivo'}
            </p>
          </div>
        </label>
      </div>
      {selectedFile && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={metadata.title}
                onChange={handleMetadataChange}
                className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base transition-colors duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                value={metadata.description}
                onChange={handleMetadataChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                Autor
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={metadata.author}
                onChange={handleMetadataChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setSelectedFile(null);
                setMetadata({ title: '', description: '', author: '' });
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-50"
              disabled={isUploading}
            >
              Cancelar
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading || !metadata.title || !metadata.author}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Enviando...</span>
                </>
              ) : (
                'Enviar arquivo'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SendBar;