import { createFileRoute } from "@tanstack/react-router";
import CameraWithZoom from "../components/camera-with-zoom";
import { useState } from "react";

export const Route = createFileRoute("/kamera")({
  component: RouteComponent,
});

function RouteComponent() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-dvh">
      <h1 className="text-xl font-bold">Testing Kamera ngezoom</h1>

      <CameraWithZoom
        onCapture={(blob) => {
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
        }}
      />

      {previewUrl && (
        <div className="mt-4">
          <h2 className="mb-2 text-sm text-gray-600">Preview hasil capture:</h2>
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-xs border rounded-lg shadow"
          />
        </div>
      )}
    </div>
  );
}
