import { createFileRoute, useNavigate } from "@tanstack/react-router";
import AnomaliTable from "../../components/Anomali/anomali-table";
import { useQuery } from "@tanstack/react-query";
import { listAnomaliQuery } from "../../queries/trans-anomali/list-anomalis";
import { useAuthStore } from "../../store/auth";
import { useState } from "react";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/20/solid";
import toast from "react-hot-toast";

export const Route = createFileRoute("/__authenticated/anomali")({
  component: RouteComponent,
});

function RouteComponent() {
  const shiftUser = useAuthStore().user?.nama_shift;
  const isPengawas = useAuthStore().user?.is_pengawas;
  const navigate = useNavigate();
  const onCatat = () => {
    if (!shiftUser && isPengawas === 0) {
      toast.error("Anda belum memiliki jadwal shift, hubungi admin!");
      return;
    }
    navigate({ to: "/form/anomali" });
  };

  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: ListData,
    isLoading,
    isFetching,
  } = useQuery(
    listAnomaliQuery(
      Number(useAuthStore.getState().user?.id_installasi),
      limit,
      (page - 1) * limit
    )
  );

  const totalPages = Math.ceil((ListData?.total ?? 0) / limit);

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      setPage(p);
    }
  };

  return (
    <div className="w-full px-4 py-4 bg-whiteCust rounded-xl">
      <button
        onClick={onCatat}
        className="w-full py-2 mt-4 mb-4 font-semibold text-white rounded-md bg-primary hover:bg-primary/80"
      >
        Catat Anomali
      </button>
      <AnomaliTable
        data={ListData?.data ?? []}
        isLoading={isLoading}
        isFetching={isFetching}
      />

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-sm">
          <button
            className="flex items-center px-3 py-1 text-white rounded bg-primary hover:bg-primary/80 disabled:opacity-50"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
          >
            <ArrowLeftCircleIcon className="w-5 h-5 mr-1" />
            Prev
          </button>

          {(() => {
            const pages = [];
            const groupIndex = Math.ceil(page / 2);
            const startPage = (groupIndex - 1) * 2 + 1;
            const endPage = Math.min(startPage + 1, totalPages);

            for (let i = startPage; i <= endPage; i++) {
              pages.push(
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  className={`px-3 py-1 rounded ${
                    page === i
                      ? "bg-primary text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {i}
                </button>
              );
            }

            if (endPage < totalPages - 1) {
              pages.push(<span key="ellipsis">...</span>);
            }

            if (endPage < totalPages) {
              pages.push(
                <button
                  key={totalPages}
                  onClick={() => goToPage(totalPages)}
                  className={`px-3 py-1 rounded ${
                    page === totalPages
                      ? "bg-primary text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {totalPages}
                </button>
              );
            }

            return pages;
          })()}

          <button
            className="flex items-center px-3 py-1 text-white rounded bg-primary hover:bg-primary/80 disabled:opacity-50"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
            <ArrowRightCircleIcon className="w-5 h-5 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}
