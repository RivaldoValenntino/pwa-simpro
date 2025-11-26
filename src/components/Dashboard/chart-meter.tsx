import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

type ChartProps = {
  jam: number[] | undefined;
  data: number[]; // dari jam 07:00 sampai akhir data
  lokasi: string;
  chartInfo: string;
  onBarClick?: (hour: number, tgl: string | undefined) => void;
  tgl: string | undefined;
};

const ChartMeter: React.FC<ChartProps> = ({
  jam,
  data,
  lokasi,
  chartInfo,
  onBarClick,
  tgl,
}) => {
  // const currentHour = serverTime ? serverTime.getHours() : 0; // Ambil jam sekarang dari server
  const currentHour = new Date().getHours();
  const isShiftPagi = currentHour >= 8 && currentHour <= 18;

  const rangeShiftPagi = Array.from({ length: 11 }, (_, i) => i + 8); // [8..18]
  const rangeShiftMalam = [
    ...Array.from({ length: 5 }, (_, i) => i + 20),
    ...Array.from({ length: 8 }, (_, i) => i),
  ]; // [19..23, 0..7]

  const activeRange = isShiftPagi ? rangeShiftPagi : rangeShiftMalam;

  // Gabungkan jam dan data jadi 1 array lalu filter berdasarkan shift
  const fullData =
    jam
      ?.map((j, i) => ({
        hour: `${j}:00`,
        total: data[i] ?? 0,
      }))
      .filter((d) => activeRange.includes(parseInt(d.hour))) ?? [];
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="font-semibold text-left">{lokasi}</div>
      <p className="m-2 text-xs text-right text-green-600">{chartInfo}</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={fullData} barCategoryGap={5}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="hour"
              interval={0}
              textAnchor="middle"
              height={30}
              angle={-35}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(total: number) => `${total} l/d`}
            />
            <Tooltip formatter={(total: number) => `${total} l/d`} />

            <ReferenceLine x={`${currentHour}:00`} />
            <Bar dataKey="total" radius={[4, 4, 0, 0]}>
              {fullData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    parseInt(entry.hour) === currentHour
                      ? "#fb923c"
                      : entry.total === 0
                        ? "#e5e7eb"
                        : "#2563eb"
                  }
                  onClick={() => onBarClick?.(parseInt(entry.hour), tgl)} // <--- callback
                  cursor="pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartMeter;
