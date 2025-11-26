import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import TimeInfo from "../../../../components/time-info";
import GensetDetailCard from "../../../../components/GNST/genset-detail-card";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../../store/auth";
import { listGensetQuery } from "../../../../queries/trans-genset/list-genset";
import CardPenggunaanBahanKimiaSkeleton from "../../../../components/skeleton/card-skeleton-bahan-kimia";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";
import BackButton from "../../../../components/back-button";

export const Route = createFileRoute(
  "/__authenticated/pages/detail-gnst/$kode"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const jam = useSearch({ strict: false }).jam;
  if (!jam) navigate({ to: "/not-found" });
  const { kode } = useParams({ strict: false });
  const [page, setPage] = useState(1);
  const limit = 10;
  const {
    data: ListData,
    isLoading,
    isFetching,
  } = useQuery(
    listGensetQuery(
      Number(useAuthStore.getState().user?.id_installasi),
      new Date().toISOString().split("T")[0],
      limit,
      (page - 1) * limit
    )
  );
  const totalPages = Math.ceil((ListData?.total ?? 0) / limit);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (isLoading || isFetching) {
    return (
      <div className="w-full p-4 bg-whiteCust rounded-xl">
        <BackButton to={`/pencatatan-harian/`} search={{ jam }} />
        <TimeInfo />
        <button className="flex items-center justify-center w-full gap-2 py-4 mb-4 text-sm font-semibold text-white transition-colors rounded-md bg-primary hover:bg-primary/80"></button>
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="mb-4" key={index}>
            <CardPenggunaanBahanKimiaSkeleton key={index} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="w-full p-4 bg-whiteCust rounded-xl">
      <BackButton to={`/pencatatan-harian/`} search={{ jam }} />
      <TimeInfo />
      <button
        className="flex items-center justify-center w-full gap-2 py-2 mb-4 text-sm font-semibold text-white transition-colors rounded-md bg-primary hover:bg-primary/80"
        onClick={() => navigate({ to: `/form/genset/${kode}?jam=${jam}` })}
      >
        <PlusCircleIcon className="w-5 h-5" strokeWidth={5} />
        Catat Genset
      </button>
      {ListData?.data && ListData.data.length > 0 ? (
        ListData.data.map((value) => (
          <div className="mb-4" key={value.id}>
            <GensetDetailCard
              foto={value.filename}
              jenis={value.jenis}
              waktuCatat={value.waktu}
              ampere={Number(value.ampere)}
              voltase={Number(value.voltase)}
              solarTerpakai={Number(value.solar)}
              durasiPakai={Number(value.durasi)}
            />
          </div>
        ))
      ) : (
        <p className="py-12 italic text-center text-gray-500">
          Tidak ada data yang tersedia.
        </p>
      )}
      <div className="flex items-center justify-center gap-2 mt-4">
        {/* Prev */}
        <button
          className="flex items-center gap-1 px-3 py-1 text-white rounded bg-primary disabled:opacity-60"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          <ArrowLeftCircleIcon className="w-5 h-5" />
          Prev
        </button>

        {/* Page Numbers */}
        {pages.map((pg) => (
          <button
            key={pg}
            className={`px-3 py-1 rounded ${
              pg === page
                ? "bg-primary text-white font-bold"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setPage(pg)}
          >
            {pg}
          </button>
        ))}

        {/* Next */}
        <button
          className="flex items-center gap-1 px-3 py-1 text-white rounded bg-primary disabled:opacity-60"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
          <ArrowRightCircleIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
