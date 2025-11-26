import { useEffect, useRef, useState } from "react";
import IcPompa from "../../assets/ic_pompa.svg";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DashboardInfoCardPompa = ({ data }: { data: any[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const width = el.clientWidth;
      const newIndex = Math.round(scrollLeft / width);
      setActiveIndex(newIndex);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <div className="flex justify-center my-2 space-x-2">
        {data.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === activeIndex ? "bg-primary" : "bg-gray-300"
            } transition duration-300`}
          />
        ))}
      </div>
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
      >
        <div className="flex">
          {data.map((pompaGroup, idx) => {
            const totalValues = [
              +pompaGroup.nilai_pompa_1,
              +pompaGroup.nilai_pompa_2,
              +pompaGroup.nilai_pompa_3,
              +pompaGroup.nilai_pompa_4,
            ];

            return (
              <div
                key={idx}
                className="flex-shrink-0 w-full min-w-full py-2 snap-center"
              >
                <div className="p-4 bg-white shadow-md rounded-xl">
                  <h1 className="mb-4 text-lg font-bold text-center">
                    {pompaGroup.nama_pompa}
                  </h1>

                  <div className="grid grid-cols-4 gap-4 justify-items-center">
                    {totalValues.map((value, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className={`mb-2 px-4 py-1 rounded-full text-white text-sm font-semibold ${
                            value > 0 ? "bg-blue-500" : "bg-orange-400"
                          }`}
                        >
                          {value}
                        </div>
                        <div className="relative w-14 h-14">
                          <img
                            src={IcPompa}
                            alt={`Pompa ${i + 1}`}
                            className="w-full h-full"
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                            {i + 1}
                          </div>
                        </div>
                        <p className="mt-2 text-sm font-medium text-center">
                          {value > 0 ? "Aktif" : "Tidak Aktif"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardInfoCardPompa;
