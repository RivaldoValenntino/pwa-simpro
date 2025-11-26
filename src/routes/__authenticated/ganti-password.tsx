/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
// import ChangePasswordIC from "../../assets/ic_ubah_password.png";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuthStore } from "../../store/auth";
import {
  UbahPasswordSchema,
  type UbahPasswordType,
} from "../../types/requests/ubah-password";
import { changePasswordUpload } from "../../queries/change-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import BackButton from "../../components/back-button";
import FullScreenSpinner from "../../components/full-screen-spinner";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/__authenticated/ganti-password")({
  component: RouteComponent,
});
type PasswordVisibility = {
  old: boolean;
  new: boolean;
  confirm: boolean;
};

function RouteComponent() {
  const navigate = useNavigate();
  const auth = useAuthStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visible, setVisible] = useState<PasswordVisibility>({
    old: false,
    new: false,
    confirm: false,
  });

  const [cachedFormData, setCachedFormData] = useState<UbahPasswordType | null>(
    null
  );

  const toggleVisibility = (key: keyof PasswordVisibility) => {
    setVisible((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UbahPasswordType>({
    resolver: zodResolver(UbahPasswordSchema),
    defaultValues: {
      id_user: auth.user?.id || 0,
    },
  });

  const onSubmit = async (data: UbahPasswordType) => {
    setCachedFormData(data);
    setIsModalOpen(true);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: changePasswordUpload,
  });
  return (
    <div className="flex items-center justify-center overflow-hidden bg-whiteCust rounded-xl">
      {isPending && <FullScreenSpinner />}
      <div className="w-full p-4 overflow-hidden text-center">
        {/* Header Section */}
        {/* <div className="flex items-center justify-between gap-2 px-2 mb-6">
          <button
            onClick={() => navigate({ to: "/profil" })}
            type="button"
          ></button>
          <p>Ubah Password</p>
        </div> */}

        {/* Profile Illustration */}
        {/* <div className="flex items-center justify-center mb-6">
          <img src={ChangePasswordIC} alt="Profile" width={200} height={200} />
        </div> */}

        <BackButton to="/profil" />
        {/* <div className="my-4">
          <h1 className="mb-2 text-2xl font-bold text-gray-800">
            Perbarui Password
          </h1>
          <p className="w-3/4 px-2 mx-auto text-sm text-center text-gray-600">
            Ubah pengaturan kata sandi anda silahkan masukkan kata sandi baru
          </p>
        </div> */}

        {/* Form Section */}
        <form className="px-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative mb-4">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Masukkan Password Lama
            </label>
            <input
              id="password_lama"
              {...register("password_lama", { required: true })}
              type={visible.old ? "text" : "password"}
              className={`w-full p-3 pr-10 rounded-lg border focus:outline-none focus:ring-1 focus:ring-primary ${
                errors.password_lama
                  ? "border border-red-500 focus:ring-red-500 focus:ring-1"
                  : "border"
              }`}
            />
            <button
              type="button"
              onClick={() => toggleVisibility("old")}
              className="btn-eye-password"
            >
              {visible.old ? (
                <Eye className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
          {errors.password_lama && (
            <p className="my-2 text-xs text-left text-red-500">
              {errors.password_lama.message}
            </p>
          )}

          {/* Password Baru */}
          <div className="relative mb-4">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Masukkan Password Baru
            </label>
            <input
              id="password_baru"
              {...register("password_baru", { required: true })}
              type={visible.new ? "text" : "password"}
              className={`w-full p-3 pr-10 rounded-lg border focus:outline-none focus:ring-1 focus:ring-primary ${
                errors.password_baru
                  ? "border border-red-500 focus:ring-red-500 focus:ring-1 outline-none focus:outline-none"
                  : "border"
              }`}
            />
            <button
              type="button"
              onClick={() => toggleVisibility("new")}
              className="btn-eye-password"
            >
              {visible.new ? (
                <Eye className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
          {errors.password_baru && (
            <p className="my-2 text-xs text-left text-red-500">
              {errors.password_baru.message}
            </p>
          )}

          {/* Konfirmasi Password Baru */}
          <div className="relative mb-4">
            <label className="block mb-2 text-sm font-medium text-left text-gray-700">
              Konfirmasi Password Baru
            </label>
            <input
              id="konfirmasi_password_baru"
              {...register("konfirmasi_password_baru", { required: true })}
              type={visible.confirm ? "text" : "password"}
              className={`w-full p-3 pr-10 rounded-lg border focus:outline-none focus:ring-1 focus:ring-primary ${
                errors.konfirmasi_password_baru
                  ? "border border-red-500 focus:ring-red-500 focus:ring-1 outline-none focus:outline-none"
                  : "border"
              }`}
            />
            <button
              type="button"
              onClick={() => toggleVisibility("confirm")}
              className="btn-eye-password"
            >
              {visible.confirm ? (
                <Eye className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
          {errors.konfirmasi_password_baru && (
            <p className="my-2 text-xs text-left text-red-500">
              {errors.konfirmasi_password_baru.message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 font-medium text-white transition bg-primary rounded-3xl hover:bg-primary/80 disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold text-center">
              Konfirmasi Ubah Password
            </h2>
            <p className="mt-2 text-sm text-center text-gray-600">
              Apakah anda yakin ingin mengubah password?
            </p>
            <div className="flex justify-between mt-6">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => setIsModalOpen(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 text-white rounded-md bg-primary hover:bg-primary/80"
                onClick={() => {
                  if (!cachedFormData) return;
                  mutate(cachedFormData, {
                    onSuccess: () => {
                      toast.success(
                        "Password Berhasil Diperbarui, Silahkan Login Kembali"
                      );
                      setTimeout(async () => {
                        auth.logout();
                        router.invalidate();
                        localStorage.clear();
                        await navigate({ to: "/login" });
                        window.location.reload();
                      }, 1000);
                    },
                    onError: (error: unknown) => {
                      console.error("Gagal menyimpan data:", error);

                      const message =
                        (error as any)?.response?.data?.message ||
                        (error as Error)?.message ||
                        "Gagal Mengubah Password";

                      toast.error(message);
                    },
                  });
                  setIsModalOpen(false);
                }}
                disabled={isPending}
              >
                {isPending ? "Memproses..." : "Yakin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
