import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useAuthStore } from "../../store/auth";
import { queryClient } from "../../main";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
// import { UserIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/outline";
export const Route = createFileRoute("/__authenticated/profil")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const auth = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleLogout = async () => {
    auth.logout();
    queryClient.clear();
    router.invalidate();
    localStorage.clear();
    router.navigate({ to: "/login" });
  };
  return (
    <div className="flex flex-col h-screen bg-whiteCust rounded-xl">
      <div className="flex justify-center h-full px-4 py-2 -mt-10 ">
        <div className="w-full max-w-3xl">
          <div className="flex flex-col gap-4 mt-12 text-blackCust">
            <h1 className="font-semibold">Pengaturan Akun</h1>
            {/* <button
              className="flex items-center gap-3 p-4 font-semibold shadow-md bg-white text-blackCust bg-redCustom rounded-xl hover:bg-white/50"
              type="button"
            >
              <UserIcon className="w-6 h-6" />
              Ubah Profil
            </button> */}
            <button
              className="flex items-center gap-3 p-4 font-semibold shadow-md bg-white text-blackCust bg-redCustom rounded-xl hover:bg-white/50"
              type="button"
              onClick={() => router.navigate({ to: "/ganti-password" })}
            >
              <LockClosedIcon className="w-6 h-6" />
              Ubah Password
            </button>
            <button
              type="button"
              className="flex items-center gap-3 p-4 font-semibold shadow-md bg-white text-blackCust bg-redCustom rounded-xl hover:bg-white/50"
              onClick={() => setIsModalOpen(true)} // Buka modal
            >
              <ArrowLeftEndOnRectangleIcon className="w-6 h-6" />
              Keluar Akun
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold text-center">Konfirmasi Logout</h2>
            <p className="mt-2 text-sm text-center text-gray-600">
              Apakah Anda yakin ingin keluar dari akun?
            </p>
            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={() => setIsModalOpen(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                onClick={handleLogout}
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
