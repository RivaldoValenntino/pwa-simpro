interface StandKubikasiProgressProps {
  total: number | undefined;
  selesai: number | undefined;
  title?: string;
  className?: string;
}

const Total: React.FC<StandKubikasiProgressProps> = ({
  total,
  selesai,
  title,
  className,
}) => {
  return (
    <div
      className={`flex justify-between items-center mb-4 w-full rounded-xl bg-white shadow-none p-4 ${className}`}
    >
      <span className="font-bold text-gray-800 text-sm">{title || ""}</span>
      <span className="text-sm text-gray-600 font-bold">
        {selesai || 0}/{total || 0}
      </span>
    </div>
  );
};

export default Total;
