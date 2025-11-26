import axios from "axios";
export interface UploadFileResponse {
  error: boolean;
  filename: string;
  mime: string;
  path: string;
  url: string;
}

export const uploadFileQuery = async (
  file: File,
  filename: string,
  path: string,
  secretKey: string
): Promise<UploadFileResponse> => {
  const formData = new FormData();

  formData.append("file", file, file.name);
  formData.append("filename", filename);
  formData.append("path", path);

  const response = await axios.post(
    "https://produksi-file-manager.kahuripan.erpsystempdam.com/produksi-file-manager-api/upload-files",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "secret-key": secretKey,
      },
    }
  );

  return response.data;
};
