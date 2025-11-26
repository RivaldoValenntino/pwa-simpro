import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { insertPencucian } from "../../../../../queries/pencucian/insert-pencucian";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { InsertPencucianRequest } from "../../../../../types/requests/pencucian/insert-cuci";
import { useAuthStore } from "../../../../../store/auth";
import { useServerTime } from "../../../../../hooks/useServerTime";
import toast from "react-hot-toast";
import FullScreenSpinner from "../../../../../components/full-screen-spinner";
import BackButton from "../../../../../components/back-button";
import { DetailPencucianChildQuery } from "../../../../../queries/pencucian/detail-cuci-child";
export const Route = createFileRoute("/__authenticated/form/cuci/input/$jenis")(
  {
    component: RouteComponent,
    validateSearch: z.object({
      id: z.number(),
      jumlah: z.number(),
      kode: z.string(),
      jam: z.number(),
    }),
  }
);

function RouteComponent() {
  const [itemList, setItemList] = useState<
    {
      id_trans_pencucian: number;
      urut_ke: number;
      jenis: string;
      status_on: 0 | 1;
      nilai: number | null;
    }[]
  >([]);
  const { jumlah } = useSearch({ strict: false });
  const id_petugas = useAuthStore.getState().user?.id;
  const time = useServerTime();
  const { id, id_trans, id_wtp } = useSearch({ strict: false });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [waktuCatat, setWaktuCatat] = useState<string>("");
  const [latlong, setLatlong] = useState<string>("");
  const navigate = useNavigate();
  const { jenis } = useParams({ strict: false });
  const { kode } = useSearch({ strict: false });
  const { jam } = useSearch({ strict: false });
  if (!jam) navigate({ to: "/not-found" });
  const handleToggle = (index: number) => {
    setItemList((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              status_on: item.status_on === 1 ? 0 : 1,
              nilai: item.status_on === 1 ? 0 : item.nilai, // reset kalau dimatikan
            }
          : item
      )
    );
  };

  const {
    data: detailChild,
    isLoading,
    isFetching,
  } = useQuery(DetailPencucianChildQuery(Number(id), jenis));

  const getUserLocation = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          resolve(`${latitude},${longitude}`);
        },
        (err) => {
          console.error("Gagal mendapatkan lokasi:", err);
          reject("Lokasi tidak bisa diakses");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const handleChangeNilai = (index: number, value: number | null) => {
    setItemList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, nilai: value } : item))
    );
  };

  useEffect(() => {
    if (id === undefined) return;

    const jumlahCuciDt = Number(jumlah);
    const itemCuciList = Array.from({ length: jumlahCuciDt }, (_, index) => ({
      urut_ke: index + 1,
      id_trans_pencucian: id,
      nilai: null,
      jenis: jenis || "",
      status_on: 0 as 0 | 1,
    }));
    setItemList(itemCuciList);
  }, [jumlah, id, jenis]);
  const insertMutation = useMutation({
    mutationFn: (payload: InsertPencucianRequest) => insertPencucian(payload),
    onSuccess: (res) => {
      console.log(res);
      setShowConfirmModal(false);
      navigate({
        to: `/pages/detail-cuci/${kode}`,
        search: {
          jam: Number(jam),
        },
      });
      // navigate({
      //   to: `/list-data/detail-cuci/${kode}?jam=${jam}`,
      // });
      toast.success("Data berhasil disimpan");
    },
    onError: (err) => {
      toast.error("Gagal menyimpan data");
      console.error(err);
    },
  });

  const handleSubmit = () => {
    // if (!latlong) {
    //   toast.error("Gagal mendapatkan lokasi");
    //   return;
    // }
    const itemListFiltered = itemList.map((item) => ({
      id_trans_pencucian: item.id_trans_pencucian,
      urut_ke: item.urut_ke,
      jenis: item.jenis,
      status_on: item.status_on,
      nilai: item.nilai ?? 0,
    }));
    // return console.log(itemListFiltered);
    const payload: InsertPencucianRequest = {
      id: Number(id),
      id_petugas: id_petugas ?? 0,
      jenis: jenis || "",
      latlong: latlong || "-",
      waktu_catat: waktuCatat || "",
      item_list: itemListFiltered,
    };

    insertMutation.mutate(payload);
  };
  useEffect(() => {
    if (time) {
      const pad = (n: number) => n.toString().padStart(2, "0");

      const formatted =
        `${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(time.getDate())} ` +
        `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

      setWaktuCatat(formatted);
    }
  }, [time]);
  useEffect(() => {
    if (id === undefined) return;

    const jumlahCuciDt = Number(jumlah);

    // bikin list default
    let itemCuciList = Array.from({ length: jumlahCuciDt }, (_, index) => ({
      urut_ke: index + 1,
      id_trans_pencucian: Number(id),
      nilai: 0,
      jenis: jenis || "",
      status_on: 0 as 0 | 1,
    }));

    // kalau ada detailChild, nimpa data sesuai urut_ke
    if (detailChild?.data && detailChild.data.length > 0) {
      itemCuciList = itemCuciList.map((item) => {
        const found = detailChild.data.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (d: any) => Number(d.urut_ke) === Number(item.urut_ke)
        );
        return found
          ? {
              ...item,
              nilai: Number(found.nilai),
              jenis: found.jenis,
              status_on: 1 as 0 | 1,
            }
          : item;
      });
    }

    setItemList(itemCuciList);
  }, [jumlah, id, jenis, detailChild]);

  return (
    <>
      <div className="p-4 bg-whiteCust rounded-xl">
        {insertMutation.isPending && <FullScreenSpinner />}
        {isLoading && <FullScreenSpinner />}
        {isFetching && <FullScreenSpinner />}
        {/* <BackButton
          to={`/form/cuci/${id}?id_wtp=${id_wtp}&kode=${kode}&jam=${jam}&id_trans=${id_trans}`}
        /> */}
        <BackButton
          to={`/form/cuci/${id}`}
          search={{
            jam: jam,
            id_wtp: id_wtp,
            id_trans: id_trans,
            kode: kode,
          }}
        />
        <div className="p-4 bg-white rounded-xl">
          <label className="block my-2 text-sm font-medium">Jumlah Cuci</label>
          <input
            type="text"
            value={jumlah}
            className="w-full px-3 py-2 mb-4 text-sm text-gray-400 bg-gray-300 rounded"
            disabled
          />

          <button
            type="button"
            onClick={async () => {
              // cek minimal 1 item ada yang dinyalakan

              // const isAnyItemOn = itemList.some((item) => item.status_on === 1);
              // if (!isAnyItemOn) {
              //   toast.error("Minimal 1 item harus on");
              //   return;
              // }
              // const invalidItem = itemList.find(
              //   (item) =>
              //     item.status_on === 1 && (!item.nilai || item.nilai === 0)
              // );

              // if (invalidItem) {
              //   toast.error(
              //     "Nilai harus diisi untuk semua item yang dinyalakan"
              //   );
              //   return;
              // }

              toast.loading("Mengambil Lokasi....");
              try {
                const location = await getUserLocation();
                toast.dismiss();
                toast.success("Berhasil Mengambil Lokasi");
                setLatlong(location);
                setShowConfirmModal(true);
              } catch (error) {
                toast.dismiss();
                setLatlong("");
                console.log(error);
                setShowConfirmModal(true);
              }
            }}
            className={`w-full py-2 mb-4 text-sm font-semibold text-white rounded bg-primary`}
            // disabled={insertMutation.isPending}
          >
            {/* {insertMutation.isPending ? "Menyimpan..." : "Proses"} */}
            Proses
          </button>

          {itemList.map((cuci, index) => (
            <div key={index} className="flex items-center justify-between mb-3">
              <button
                onClick={() => handleToggle(index)}
                className={`w-14 h-6 rounded-full transition-colors duration-300 flex items-center px-1 ${
                  cuci.status_on ? "bg-green-200" : "bg-gray-200"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full  transform transition-transform ${
                    cuci.status_on
                      ? "translate-x-8 bg-green-500"
                      : "translate-x-0 bg-red-500"
                  }`}
                />
              </button>

              <span className="text-sm font-medium">Cuci {cuci.urut_ke}</span>

              <input
                type="number"
                value={cuci.nilai || ""}
                disabled={!cuci.status_on}
                onChange={(e) =>
                  handleChangeNilai(index, Number(e.target.value))
                }
                className={`w-20 px-2 py-1 rounded text-sm text-center focus:ring-1 focus:ring-primary border-none outline-none ${cuci.status_on === 0 ? `bg-gray-300 text-blackCust cursor-not-allowed` : `bg-grayCust text-gray-500`}`}
                placeholder="-"
              />
            </div>
          ))}
        </div>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="p-6 bg-white shadow-lg rounded-xl w-80">
              <h2 className="mb-4 text-lg font-semibold text-center">
                Konfirmasi
              </h2>
              <p className="mb-6 text-sm text-center text-gray-600">
                Apakah Anda yakin ingin menyimpan data ini?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={insertMutation.isPending}
                >
                  {insertMutation.isPending ? "Menyimpan..." : "Ya, Simpan"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
