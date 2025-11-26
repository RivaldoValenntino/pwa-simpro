import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import AuthLayout from "../layouts/auth-layout";
import { Toaster } from "react-hot-toast";

export const Route = createFileRoute("/__authenticated")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const token = context.auth.token;
    const user = context.auth.user;
    if (!token && !user) {
      throw redirect({ to: "/login" });
    }
  },
});

function RouteComponent() {
  return (
    <AuthLayout>
      <Outlet />
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
    </AuthLayout>
  );
}
