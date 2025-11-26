import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import LoginIc from "../assets/login_ic.svg";
import FloatingInput from "../components/ui/floating-input";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { useAuthStore } from "../store/auth";
import { useMutation } from "@tanstack/react-query";
import { api } from "../libs/api";
import toast, { Toaster } from "react-hot-toast";
import type { LoginPost, LoginResponse } from "../types/responses/login";
import type { ErrorResponse } from "../types/responses/error";
import { useDashboardStore } from "../store/dashboard-store";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
  beforeLoad: ({ context }) => {
    const token = context.auth.token;
    const user = context.auth.user;
    if (token && user) {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function LoginComponent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const auth = useAuthStore();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<LoginPost>();

  const { mutate } = useMutation({
    mutationFn: async (data: LoginPost) => {
      const response = await api.post<LoginResponse>("/mobile/login", data);
      return response.data;
    },

    onSuccess: (data: LoginResponse) => {
      auth.setToken(data.token);
      auth.setUser(data.user);

      const dashboardStore = useDashboardStore.getState();
      if (!localStorage.getItem("dashboard")) {
        dashboardStore.setDashboard({ value: "MTR", label: "Meter Produksi" });
      }

      toast.success("Login berhasil anda akan diarahkan ke dashboard!");
      setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 2000);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      // if (error.response?.status === 400) {
      const errorMessage =
        error.response?.data?.message ||
        "Login gagal. Periksa kembali username dan password!";

      toast.error(errorMessage);
      setLoading(false);
      // }
    },
  });

  function onSubmit(data: LoginPost) {
    setLoading(true);
    mutate(data);
  }

  useEffect(() => {
    setFocus("username");
  }, [setFocus]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-white font-poppins">
      <div className="w-full max-w-md py-6">
        <div className="flex items-center justify-center mb-6">
          <img src={LoginIc} alt="Login" width={300} height={300} />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-center text-gray-800">
          Masuk ke Aplikasi
        </h1>
        <p className="w-3/4 px-2 mx-auto mb-4 text-sm text-center text-gray-600">
          Masukan informasi pengguna Anda di bawah ini untuk melanjutkan
        </p>

        <div className="p-6 bg-white border border-gray-200 rounded-md shadow-none">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FloatingInput
              id="username"
              label="Username"
              type="text"
              error={!!errors.username}
              {...register("username", { required: true })}
            />
            {errors.username && (
              <p className="-mt-2 text-sm text-red-500">Username wajib diisi</p>
            )}

            <FloatingInput
              id="password"
              label="Password"
              type="password"
              error={!!errors.password}
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="-mt-2 text-sm text-red-500">Password wajib diisi</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white transition rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            padding: "12px 16px",
            background: "#F5F5F5",
            color: "#000000",
            fontSize: "14px",
            borderRadius: "10px",
          },
        }}
      />
    </div>
  );
}

export default LoginComponent;
