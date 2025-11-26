import React, { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const isInStandaloneMode = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.navigator as any).standalone === true; // untuk iOS Safari

  useEffect(() => {
    if (isInStandaloneMode()) {
      return;
    }

    const isAppleDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isAppleDevice);

    const handleBeforeInstallPrompt = (event: Event) => {
      const beforeInstallEvent = event as BeforeInstallPromptEvent;
      beforeInstallEvent.preventDefault();
      setDeferredPrompt(beforeInstallEvent);
      setShowAlert(true);
    };

    if (!isAppleDevice) {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    } else {
      setShowAlert(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      setDeferredPrompt(null);
      setShowAlert(false);
    }
  };

  const handleClose = () => {
    setShowAlert(false);
  };

  if (!showAlert) return null;

  return (
    <>
      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
          <div className="w-full max-w-sm p-5 bg-white shadow-lg rounded-xl">
            <h2 className="mb-1 text-lg font-bold">
              {!isIOS ? "Install SIMPRO" : "Tambah ke layar utama"}
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              {!isIOS
                ? "Untuk pengalaman lebih baik, install aplikasi ini ke layar utama perangkat Anda."
                : 'Tekan tombol "Share" pada Safari, lalu pilih "Add to Home Screen" atau "Tambahkan ke Layar Utama".'}
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm text-gray-700 border rounded-lg hover:bg-gray-100"
              >
                {!isIOS ? "Batal" : "Tutup"}
              </button>
              {!isIOS && (
                <button
                  onClick={handleInstall}
                  className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-primary hover:bg-primary/80"
                >
                  Install
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallPrompt;
