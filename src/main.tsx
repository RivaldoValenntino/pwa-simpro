import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import { router } from "./router";
import InstallPrompt from "./components/install-prompt";
import { useAuthStore } from "./store/auth";
import { ServerTimeProvider } from "./providers/server-time-provider";
import { useEffect, useState } from "react";
import { registerSW } from "virtual:pwa-register";
// import { useRegisterSW } from "virtual:pwa-register/react";

export const queryClient = new QueryClient();

function App() {
  const [needRefresh, setNeedRefresh] = useState(false);
  // const { needRefresh, updateServiceWorker } = useRegisterSW();
  const auth = useAuthStore();

  useEffect(() => {
    registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        console.log("App ready to work offline");
      },
    });
  }, []);

  // console.log(needRefresh[0], "needRefresh");
  return (
    <>
      {needRefresh && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-w-sm p-6 text-center bg-white shadow-lg rounded-2xl">
            <h2 className="mb-2 text-lg font-semibold">
              Versi baru tersedia 🚀
            </h2>
            <p className="mb-4 text-gray-600">
              Silakan refresh aplikasi untuk mendapatkan update terbaru.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-white bg-blue-600 rounded-md"
            >
              Perbarui Sekarang
            </button>
          </div>
        </div>
      )}
      {/* Modal Update */}
      {/* {needRefresh[0] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
          <div className="w-full max-w-sm p-6 text-center bg-white shadow-xl rounded-2xl">
            <h2 className="text-lg font-semibold text-gray-800">
              Versi Baru Tersedia 🚀
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ada pembaruan terbaru untuk aplikasi ini. Silakan perbarui agar
              mendapatkan fitur terbaru dan perbaikan bug.
            </p>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  updateServiceWorker(false);
                }}
                className="px-3 py-2 text-sm text-black transition-colors border rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => updateServiceWorker(true)}
                className="px-3 py-2 text-sm text-white transition-colors bg-blue-600 rounded-lg shadow hover:bg-blue-700"
              >
                Perbarui
              </button>
            </div>
          </div>
        </div>
      )} */}

      <RouterProvider router={router} context={{ queryClient, auth }} />
    </>
  );
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <ServerTimeProvider>
        <InstallPrompt />
        <App />
      </ServerTimeProvider>
    </QueryClientProvider>
  );
}
