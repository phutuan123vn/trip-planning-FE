import api from "@/lib/axios";
import type { ImageResponse } from "@/types/Image";
import type { PaginatedResponse } from "@/types/Response";

const API_PATH = "/images";

export interface UploadImagePayload {
  file: File;
  fileName?: string;
}

export const uploadImage = async (payload: UploadImagePayload): Promise<ImageResponse> => {
  const formData = new FormData();
  formData.append("file", payload.file);
  if (payload.fileName) {
    formData.append("fileName", payload.fileName);
  }

  const { data: res } = await api.post<PaginatedResponse<ImageResponse>>(`${API_PATH}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data[0];
};

export const deleteImage = async (id: string): Promise<void> => {
  await api.delete(`${API_PATH}/${id}`);
};
