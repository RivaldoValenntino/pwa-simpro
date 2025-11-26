// components/Dashboard/dashboard-info-card-dosis.tsx

type DosisCardProps = {
  data: {
    nama_reservoar: string;
    ppm: string | null;
    sisa_khlor: string | null;
  }[];
};

export default function DashboardInfoCardDosis({ data }: DosisCardProps) {
  return (
    <div className="p-4 bg-white rounded-2xl">
      {/* Header */}
      {/* <div className="inline-flex items-center px-4 py-1 mb-4 text-sm font-semibold text-white rounded-md bg-orangeCust">
        Hasil Catat :{" "}
        <span className="ml-2 font-bold text-white">⏱ 10.45</span>
      </div> */}

      {/* Cards grid */}
      <div className="gap-4 dosis-grid">
        {data.length > 0
          ? data.map((item, index) => (
              <div
                key={index}
                className="bg-[#CEDAFF] rounded-xl px-2 py-3 shadow-md flex flex-col items-center"
              >
                <div className="px-2 py-1 mb-2 text-xs font-semibold text-center text-white rounded bg-greenCust">
                  {item.nama_reservoar}
                </div>
                <div className="flex items-center justify-between w-full gap-3 px-4 text-sm font-medium">
                  <div className="items-center justify-center flex-1 text-center">
                    <div className="flex px-1">
                      <div className="w-[5px] bg-primary mx-auto mb-1 rounded-xl" />
                      <div className="flex flex-col">
                        <p className="text-[10px] text-blue-800">Nilai PPM</p>
                        <p className="text-base font-bold text-blue-800">
                          {Number(item.ppm)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="items-center justify-center flex-1 text-center">
                    <div className="flex px-1">
                      <div className="w-[5px] bg-orangeCust mx-auto mb-1 rounded-xl" />
                      <div className="flex flex-col">
                        <p className="text-[10px] text-orangeCust">
                          Sisa KHLOR
                        </p>
                        <p className="text-base font-bold text-orangeCust">
                          {Number(item.sisa_khlor)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`dummy-${index}`}
                className="bg-[#CEDAFF] rounded-xl px-2 justify-center py-3 shadow-md flex flex-col items-center"
              >
                <div className="px-2 py-1 mb-2 text-xs font-semibold text-center text-white rounded bg-greenCust">
                  -
                </div>
                <div className="flex items-center justify-between w-full gap-3 px-4 text-sm font-medium">
                  <div className="items-center justify-center flex-1 text-center">
                    <div className="flex mr-8">
                      <div className="w-[5px] bg-primary mx-auto mb-1 rounded-xl" />
                      <div className="flex flex-col">
                        <p className="text-[10px] text-blue-800">Nilai PPM</p>
                        <p className="text-base font-bold text-blue-800">-</p>
                      </div>
                    </div>
                  </div>
                  <div className="items-center justify-center flex-1 text-center">
                    <div className="flex mr-8">
                      <div className="w-[5px] bg-orangeCust mx-auto mb-1 rounded-xl" />
                      <div className="flex flex-col">
                        <p className="text-[10px] text-orangeCust">
                          Sisa KHLOR
                        </p>
                        <p className="text-base font-bold text-orangeCust">-</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
