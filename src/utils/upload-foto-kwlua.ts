import { uploadFileQuery } from "../queries/upload-file/upload-file";
import imageCompression from "browser-image-compression";
export async function uploadFotoKwlua({
  dataUrl,
  idWtp,
  label,
  id,
}: {
  dataUrl: string;
  idWtp: string | number;
  label: "ph" | "ntu";
  id: string | undefined;
}) {
  const secretKey = import.meta.env.VITE_API_SECRET_KEY;

  const originalFile = dataURLtoFile(dataUrl, `foto_${label}_${id}.jpg`);
  const compressedFile = await imageCompression(originalFile, {
    maxSizeMB: 0.2, // maks 200KB
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  });
  const uploadResult = await uploadFileQuery(
    compressedFile,
    `KWLUA_${label}_${idWtp}_${Date.now()}`,
    "simpro/trans/foto_kwlua",
    secretKey
  );

  return {
    compressedFile,
    url: uploadResult.url,
  };
}

function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
