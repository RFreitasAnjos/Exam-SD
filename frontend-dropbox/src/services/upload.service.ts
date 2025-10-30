import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/archives/upload'; // Ajuste conforme sua configuração

export interface UploadResponse {
  id: number;
  title: string;
  description?: string;
  path: string;
  filename: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export const uploadFile = async (
  file: File,
  metadata: {
    title: string;
    description?: string;
    author: string;
  }
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Adiciona os metadados ao FormData
  Object.entries(metadata).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });

  try {
    const response = await axios.post<UploadResponse>(
      `${API_BASE_URL}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Erro ao enviar arquivo');
    }
    throw error;
  }
};