import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/not-found")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <section className="flex items-center h-screen text-gray-100 bg-gray-900 dark:bg-gray-50 dark:text-gray-800">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl text-primary">404</h2>
          <p className="text-2xl font-semibold md:text-3xl">
            Maaf, Halaman yang Anda cari tidak ditemukan atau URL tidak valid
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="flex items-center justify-center w-full py-4 mt-4 font-bold text-white transition rounded-full bg-primary hover:bg-primary/80"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}
