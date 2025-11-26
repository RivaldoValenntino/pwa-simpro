import React, { useState, useRef } from "react";
import ReminderCard from "./Dashboard/reminder-card";

interface ReminderItem {
  kode: string;
  nama: string;
  is_per_jam: string;
  persentase_catat: string;
  jumlah_catat: string;
}

interface DashboardCardReminderProps {
  data: ReminderItem[];
  isLoading?: boolean;
  //   autoPlay?: boolean;
}

const DashboardCardReminder: React.FC<DashboardCardReminderProps> = ({
  data,
  isLoading,
  //   autoPlay = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const reminders = (data || [])
    .filter((item) => item.is_per_jam === "1") // hanya ambil jika kode TIDAK ada di excludedCodes
    .map((item, index) => ({
      id: index,
      title: item.nama,
      progress: parseFloat(item.persentase_catat),
      jumlah_catat: item.jumlah_catat,
    }));

  // AutoPlay
  //   useEffect(() => {
  //     if (!autoPlay || reminders.length === 0) return;
  //     const interval = setInterval(() => {
  //       setCurrentIndex((prev) => (prev + 1) % reminders.length);
  //     }, 3000);
  //     return () => clearInterval(interval);
  //   }, [autoPlay, reminders.length]);

  // Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX !== null) {
      const diff = startX - e.changedTouches[0].clientX;
      if (diff > 50) {
        // geser kiri → next
        setCurrentIndex((prev) => (prev + 1) % reminders.length);
      } else if (diff < -50) {
        // geser kanan → prev
        setCurrentIndex((prev) =>
          prev === 0 ? reminders.length - 1 : prev - 1
        );
      }
    }
  };

  if (isLoading) {
    return <p className="text-gray-500">Loading reminder...</p>;
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <h2 className="text-lg font-semibold my-4 px-4">
        Progress Pencatatan Sekarang
      </h2>
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {reminders.map((item) => (
          <div key={item.id} className="w-full flex-shrink-0 px-2 mb-8">
            <ReminderCard
              title={item.title}
              progress={item.progress}
              remaining={item.jumlah_catat}
            />
          </div>
        ))}
      </div>

      {/* indikator */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2">
        {reminders.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full ${
              currentIndex === i ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardCardReminder;
