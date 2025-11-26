import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import TimeInfo from "../../../../components/time-info";
import BackButton from "../../../../components/back-button";
import { listHoursMeterPompaQuery } from "../../../../queries/hours-pompa/list-hours-meter";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../../store/auth";
import { useState } from "react";
import HoursMeterCard from "../../../../components/HOURS-METER/hours-meter-card";
import toast from "react-hot-toast";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import CardPenggunaanBahanKimiaSkeleton from "../../../../components/skeleton/card-skeleton-bahan-kimia";
export const Route = createFileRoute(
  "/__authenticated/pages/detail-mtr-hrs/$kode"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { kode } = useParams({ strict: false });
  const navigate = useNavigate();
  const { jam } = useSearch({ strict: false });
  if (!jam) navigate({ to: "/not-found" });
  const [page, setPage] = useState(1); // halaman sekarang
  const idInstallasi = Number(useAuthStore.getState().user?.id_installasi);
  const limit = 10;
  const {
    data: ListData,
    isLoading,
    isFetching,
  } = useQuery(
    listHoursMeterPompaQuery(
      idInstallasi,
      new Date().toISOString().split("T")[0],
      limit,
      (page - 1) * limit
    )
  );

  const totalRows = ListData?.total ?? 0;
  const totalPages = Math.ceil(totalRows / limit);

  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const handleJump = (p: number) => {
    setPage(p);
  };
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
        type="button"
        className="flex items-center justify-center w-full gap-2 py-2 mb-4 text-sm font-semibold text-white transition-colors rounded-md bg-primary hover:bg-primary/80"
        onClick={() => navigate({ to: `/form/hours-pompa/${kode}?jam=${jam}` })}
      >
        <PlusCircleIcon className="w-5 h-5" strokeWidth={5} />
        Catat Hours Meter Pompa
      </button>
      {ListData?.data && ListData.data.length > 0 ? (
        ListData.data.map((value) => (
          <div className="mb-4" key={value.id}>
            <HoursMeterCard
              image={
                value.file !== null || value.file !== "" ? value.file : null
              }
              tanggalCatat={value.tgl}
              urutKe={value.urut_ke}
              namaPompa={value.nama_pompa}
              nilai={Number(value.nilai)}
              waktuCatat={value.waktu_catat}
              onAction={() => toast.error("Fitur belum tersedia")}
            />
          </div>
        ))
      ) : (
        <p className="py-12 italic text-center text-gray-500">
          Tidak ada data yang tersedia.
        </p>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="flex items-center justify-center px-4 py-2 text-white rounded bg-primary hover:bg-primary/80 disabled:opacity-80"
        >
          <ArrowLeftCircleIcon className="inline-block w-5 h-5 mr-1" />
          Prev
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          return (
            <button
              key={pageNum}
              onClick={() => handleJump(pageNum)}
              className={`px-3 py-1 border rounded border-primary ${
                page === pageNum ? "bg-primary text-white" : ""
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="flex items-center justify-center px-4 py-2 text-white rounded bg-primary hover:bg-primary/80 disabled:opacity-80"
        >
          Next
          <ArrowRightCircleIcon className="inline-block w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
}
