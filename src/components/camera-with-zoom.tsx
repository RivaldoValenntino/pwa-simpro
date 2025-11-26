/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefreshCcw, ZoomIn, ZoomOut } from "lucide-react";
import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { toast } from "react-hot-toast";

type FacingMode = "environment" | "user";

export interface CameraWithZoomProps {
  defaultFacing?: FacingMode;
  onCapture?: (file: File, dataUrl: string) => void;
  onClose?: () => void;
  className?: string;
}

function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, {
    type: blob.type,
    lastModified: Date.now(),
  });
}

const CameraWithZoom: React.FC<CameraWithZoomProps> = ({
  defaultFacing = "environment",
  onCapture,
  onClose,
  className = "",
}) => {
  const webcamRef = useRef<Webcam>(null);

  const [facingMode, setFacingMode] = useState<FacingMode>(defaultFacing);
  const [zoom, setZoom] = useState(1); // current zoom value
  const [maxZoom, setMaxZoom] = useState<number>(4); // default digital max zoom

  // Torch states (web-only)
  const [torchSupported, setTorchSupported] = useState<boolean | null>(null);
  const [torchOn, setTorchOn] = useState(false);

  const createdStreamRef = useRef<MediaStream | null>(null);

  // === CAPTURE FOTO dengan zoom effect (digital fallback) ===
  const capturePhoto = useCallback(() => {
    if (!webcamRef.current) return;
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;

    const img = new Image();
    img.src = screenshot;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const originalWidth = img.width;
      const originalHeight = img.height;

      canvas.width = originalWidth;
      canvas.height = originalHeight;

      const cropWidth = originalWidth / zoom;
      const cropHeight = originalHeight / zoom;
      const cropX = (originalWidth - cropWidth) / 2;
      const cropY = (originalHeight - cropHeight) / 2;

      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        originalWidth,
        originalHeight
      );

      canvas.toBlob((blob) => {
        if (blob && onCapture) {
          const file = blobToFile(blob, "camera.jpg");
          onCapture(file, canvas.toDataURL("image/jpeg"));
        }
      }, "image/jpeg");
    };
  }, [onCapture, zoom]);

  // ====== Helpers ======
  function getCurrentStream(): MediaStream | null {
    try {
      const videoEl: HTMLVideoElement | undefined | null =
        webcamRef.current?.video;
      const src = videoEl?.srcObject;
      if (src && src instanceof MediaStream) return src;
      return null;
    } catch (e) {
      alert(e);
      console.error(e);
      return null;
    }
  }

  // ====== Hardware Zoom ======
  async function setCameraZoom(next: number) {
    try {
      const stream = getCurrentStream();
      if (!stream) {
        setZoomValue(next); // fallback
        return;
      }

      const track = stream.getVideoTracks()[0];
      const caps = track.getCapabilities?.() ?? {};
      const settings = track.getSettings?.() ?? {};

      if (!caps.zoom) {
        console.warn("Zoom hardware tidak didukung, fallback ke digital zoom");
        setZoomValue(next);
        return;
      }

      // clamp sesuai kemampuan kamera
      const min = (caps.zoom as { min: number }).min ?? 1;
      const max = (caps.zoom as { max: number }).max ?? 5;
      const clamped = Math.max(min, Math.min(max, next));

      await track.applyConstraints({ advanced: [{ zoom: clamped }] });

      setZoom(clamped);
      setMaxZoom(max);

      console.log(
        `Applied hardware zoom ${clamped} (range ${min} - ${max}), current:`,
        settings.zoom
      );
    } catch (err) {
      console.error("Zoom gagal:", err);
      // toast.error("Zoom hardware gagal, fallback ke digital zoom");
      setZoomValue(next);
    }
  }

  function setZoomValue(next: number) {
    const clamped = Math.max(1, Math.min(maxZoom, next));
    setZoom(clamped);
  }

  // ====== Torch (sama seperti sebelumnya) ======
  async function detectTorchSupport(): Promise<boolean> {
    try {
      const stream = getCurrentStream();
      let track: MediaStreamTrack | null = null;

      if (stream) {
        track = stream.getVideoTracks()[0] ?? null;
      } else {
        const tmp = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
        });
        createdStreamRef.current = tmp;
        track = tmp.getVideoTracks()[0] ?? null;
      }

      if (!track) return false;
      const caps =
        typeof (track as any).getCapabilities === "function"
          ? track.getCapabilities()
          : {};

      if (caps && "torch" in caps) return true;

      if ("ImageCapture" in window) {
        try {
          const imageCapture = new (window as any).ImageCapture(track);
          const photoCaps = await imageCapture.getPhotoCapabilities();
          if (
            Array.isArray(photoCaps.fillLightMode) &&
            photoCaps.fillLightMode.includes("torch")
          ) {
            return true;
          }
        } catch (e) {
          console.log("Error getting photo capabilities:", e);
        }
      }
      return false;
    } catch (err) {
      console.log("Error checking torch support:", err);
      return false;
    }
  }

  async function setTorch(on: boolean) {
    try {
      let stream = getCurrentStream();
      let createdByUs = false;

      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
        });
        if (webcamRef.current?.video) {
          webcamRef.current.video.srcObject = stream;
        }
        createdStreamRef.current = stream;
        createdByUs = true;
      }

      const track = stream.getVideoTracks()[0];
      if (!track) throw new Error("No video track available for torch");

      const caps = track.getCapabilities?.() ?? {};
      if (!caps || !("torch" in caps)) {
        throw new Error("Torch capability not available");
      }

      await track.applyConstraints({ advanced: [{ torch: !!on }] } as any);

      setTorchOn(on);
      setTorchSupported(true);

      if (!on && createdByUs && createdStreamRef.current) {
        createdStreamRef.current.getTracks().forEach((t) => t.stop());
        createdStreamRef.current = null;
      }
    } catch (err: any) {
      setTorchSupported(false);
      toast.error(
        err?.message ?? "Torch operation failed on this device/browser"
      );
      throw err;
    }
  }

  async function toggleTorch() {
    if (torchSupported === false) {
      toast.error("Flashlight tidak didukung");
      return;
    }

    try {
      if (torchSupported === null) {
        const supported = await detectTorchSupport();
        setTorchSupported(supported);
        if (!supported) {
          toast.error("Flashlight tidak didukung");
          return;
        }
      }
      await setTorch(!torchOn);
    } catch (e) {
      console.warn("toggleTorch error:", e);
    }
  }

  useEffect(() => {
    return () => {
      if (createdStreamRef.current) {
        createdStreamRef.current.getTracks().forEach((t) => t.stop());
        createdStreamRef.current = null;
      }
    };
  }, []);
  // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file && onCapture) {
  //     onCapture(file, URL.createObjectURL(file)); // kirim juga dataUrl untuk preview
  //   }
  // };

  // ====== Render ======
  return (
    <div
      className={`relative mx-auto w-dvw h-dvh bg-black rounded-xl overflow-hidden ${className}`}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute z-10 flex items-center justify-center w-10 h-10 text-white rounded-full top-3 left-3 bg-black/50"
        >
          ✕
        </button>
      )}

      {/* Frame camera (digital zoom fallback pakai scale) */}
      <div
        className="relative flex items-center justify-center w-full h-full"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center",
        }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: facingMode,
            width: 1280,
            height: 720,
          }}
          className="object-cover w-full h-full"
          onUserMediaError={(err: any) => alert("Webcam error: " + err.message)}
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 px-2 py-4 bg-black">
        <button
          onClick={() =>
            setFacingMode((prev) =>
              prev === "environment" ? "user" : "environment"
            )
          }
          className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-center border rounded-full bg-white/70 sm:w-14 sm:h-14"
        >
          <RefreshCcw className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={() => setCameraZoom(zoom - 0.5)}
          className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-white/80 sm:w-14 sm:h-14"
        >
          <ZoomOut className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={capturePhoto}
          className="flex-shrink-0 w-16 h-16 bg-white border-gray-500 rounded-full border-[5px] sm:w-20 sm:h-20"
        />

        <button
          onClick={() => setCameraZoom(zoom + 0.5)}
          className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-white/80 sm:w-14 sm:h-14"
        >
          <ZoomIn className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={toggleTorch}
          className={`flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full sm:w-14 sm:h-14 ${
            torchOn ? "bg-yellow-400" : "bg-white/80"
          }`}
          title="Toggle Torch"
        >
          🔦
        </button>

        {/*<label className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full cursor-pointer bg-white/80 sm:w-14 sm:h-14">
          <ImagesIcon className="w-5 h-5 sm:w-6 sm:h-6" /> 
          <input type="file" className="hidden" onChange={handleFileUpload} />
        </label>*/}
      </div>
    </div>
  );
};

export default CameraWithZoom;
