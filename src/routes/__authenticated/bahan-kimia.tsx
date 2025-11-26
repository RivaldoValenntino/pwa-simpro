import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { listTotalPenggunaanBahanKimiaQuery } from "../../queries/fetch-total-penggunaan-bahan-kimia";
import { useAuthStore } from "../../store/auth";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FlaskConical, Fuel, Beaker, Tablets, Weight } from "lucide-react";

export const Route = createFileRoute("/__authenticated/bahan-kimia")({
  component: RouteComponent,
});

const listJenisItems = [
  { title: "Alum", kode: "Alum", icon: FlaskConical },
  { title: "Kaporit", kode: "Kaporit", icon: Weight },
  { title: "Solar", kode: "Solar", icon: Fuel },
  { title: "PAC", kode: "PAC", icon: Tablets },
  { title: "Soda ash", kode: "soda_ash", icon: Beaker },
];

function RouteComponent() {
  const navigate = useNavigate();
  const shiftUser = useAuthStore().user?.nama_shift;
  const isPengawas = useAuthStore().user?.is_pengawas;
  console.log(shiftUser);
  const { data: ListTotalData } = useQuery(
    listTotalPenggunaanBahanKimiaQuery(
      useAuthStore.getState().user?.id,
      new Date().toISOString().split("T")[0] // Use today's date
    )
  );
  return (
    <>
      <div className="w-full p-4 bg-whiteCust rounded-xl">
        <div className="grid grid-cols-2 gap-3 mt-4">
          {listJenisItems.map((item, idx) => {
            const totalItem = ListTotalData?.data.find(
              (d) =>
                d.jenis_bahan_kimia.toLowerCase() === item.title.toLowerCase()
            );

            return (
              <div
                key={idx}
                className="flex flex-col items-center p-3 text-center bg-white rounded-md shadow-none cursor-pointer"
              >
                <div className="flex items-center justify-center mb-2 rounded-lg bg-blue-50 w-12 h-12">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>

                <p className="text-sm font-medium text-gray-800">
                  {item.title}
                </p>

                {/* 🔵 Total Badge */}
                <span className="px-2 py-1 mt-1 text-xs font-semibold text-black bg-gray-100 rounded-md">
                  Total : {totalItem?.total ?? 0}
                </span>

                <div className="flex flex-col w-full gap-2 mt-2 sm:flex-row">
                  <button
                    className="w-full py-2 text-xs font-semibold text-gray-700 rounded-md bg-greenCust"
                    onClick={() => {
                      navigate({
                        to: `/penggunaan-bahan-kimia?kode=${item.kode}`,
                      });
                    }}
                  >
                    Sudah
                  </button>
                  <button
                    className="w-full py-2 text-xs font-semibold text-white rounded-md bg-primary"
                    onClick={() => {
                      if (!shiftUser && isPengawas == 0) {
                        toast.error(
                          "Anda belum memiliki jadwal shift, hubungi admin!"
                        );
                        return;
                      }
                      navigate({
                        to: `/form/penggunaan-bahan-kimia/${item.kode}`,
                      });
                    }}
                  >
                    Catat
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
