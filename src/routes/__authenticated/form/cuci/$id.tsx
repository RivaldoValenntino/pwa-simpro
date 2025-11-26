import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { DetailPencucianQuery } from "../../../../queries/pencucian/detail-cuci";
import { useQuery } from "@tanstack/react-query";
import TimeInfo from "../../../../components/time-info";
import GambarDetailCuci from "../../../../assets/ic_detail_cuci.png";
import Total from "../../../../components/ui/total";
import { listCuciQuery } from "../../../../queries/pencucian/list-cuci";
import { useAuthStore } from "../../../../store/auth";
import { useServerTime } from "../../../../hooks/useServerTime";
import BackButton from "../../../../components/back-button";
import CardGridSkeleton from "../../../../components/skeleton/card-grid-skeleton";

export const Route = createFileRoute("/__authenticated/form/cuci/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { kode } = useSearch({ strict: false });
  const { jam } = useSearch({ strict: false });
  const id_installasi = useAuthStore.getState().user?.id_installasi;

  const time = useServerTime();

  const {
    data: detailCuci,
    isLoading: isLoadingDetailCuci,
    isFetching: isFetchingDetailCuci,
  } = useQuery(DetailPencucianQuery(Number(id), kode));

  const {
    data: ListData,
    isLoading: isLoadingListData,
    isFetching: isFetchingListData,
  } = useQuery(
    listCuciQuery(
      time?.toISOString().split("T")[0],
      kode,
      Number(id_installasi),
      jam
    )
  );

  const totalData = ListData?.data.length;
  const selesaiData = ListData?.data.filter(
    (item) =>
      item.is_sedimen_exist === "1" &&
      item.is_filtrasi_exist === "1" &&
      item.is_flokulator_exist === "1"
  ).length;
  const navigate = useNavigate();
  if (!jam) navigate({ to: "/not-found" });
  const mappedData = detailCuci?.data?.[0]
    ? [
        {
          nama: "Sedimen",
          value: "sedimen",
          jumlah: Number(detailCuci.data[0].jml_sedimen) || 0,
        },
        {
          nama: "Filtrasi",
          value: "filtrasi",
          jumlah: Number(detailCuci.data[0].jml_filtrasi) || 0,
        },
        {
          nama: "Flokulator",
          value: "flokulator",
          jumlah: Number(detailCuci.data[0].jml_flokulator) || 0,
        },
      ]
    : [];

  if (
    isLoadingDetailCuci ||
    isLoadingListData ||
    isFetchingDetailCuci ||
    isFetchingListData
  )
    return (
      <div className="w-full p-4 overflow-hidden shadow-none bg-whiteCust rounded-xl">
        <CardGridSkeleton />;
      </div>
    );

  return (
    <div className="w-full p-4 overflow-hidden shadow-none bg-whiteCust rounded-xl">
      <BackButton
        to={`/pages/detail-cuci/${kode}`}
        search={{
          jam: jam,
        }}
      />
      <TimeInfo />
      <Total total={totalData} selesai={selesaiData} title="Pencucian" />
      <div className="flex flex-col gap-4">
        {mappedData.map((item, idx) => (
          <div
            onClick={() => {
              // const route = specialRoutes[item.kode] || "detail";
              navigate({
                to: `/form/cuci/input/${item.value}?id=${id}&kode=${kode}&jumlah=${item.jumlah}&jam=${Number(
                  detailCuci?.data[0].jam
                )}&id_wtp=${detailCuci?.data[0].id_wtp}&id_trans=${detailCuci?.data[0].id_trans}`,
              });
            }}
            key={idx}
            className="flex flex-col items-center p-3 text-center bg-white rounded-md shadow-none cursor-pointer"
          >
            <div className="flex items-center justify-center w-20 h-20 mb-2 rounded-lg">
              <img
                src={GambarDetailCuci}
                alt={item.nama}
                className="object-contain w-24 h-24"
              />
            </div>

            {/* <div
                className={`text-white text-xs font-semibold px-2 py-1 rounded-full w-full mb-1 mt-2 ${item.progressColor}`}
              >
                {item.progress}
              </div> */}
            <p className="text-sm font-medium text-gray-800">{item.nama}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
