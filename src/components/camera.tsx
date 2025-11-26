import React from "react";
import CameraWithZoom from "./camera-with-zoom";

interface CameraModalProps {
  open: boolean;
  onClose: () => void;
  onCapture: (blob: Blob) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({
  open,
  onClose,
  onCapture,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-md mx-auto overflow-hidden bg-white shadow-lg rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h2 className="text-lg font-semibold">Ambil Foto</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            ✕
          </button>
        </div>

        {/* Frame Kamera */}
        <div className="flex items-center justify-center p-4">
          <div className="relative overflow-hidden border-4 border-white shadow-md w-72 h-72 rounded-xl">
            <CameraWithZoom
              className="w-full h-full"
              onCapture={(blob) => {
                onCapture(blob);
                onClose();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraModal;
