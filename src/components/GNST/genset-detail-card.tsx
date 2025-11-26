import toast from "react-hot-toast";
import NoImage from "../../assets/images/no-image.jpg";
type GensetDetailCardProps = {
  waktuCatat: string;
  ampere: number;
  voltase: number;
  solarTerpakai: number;
  durasiPakai: number;
  jenis: string;
  foto: string;
};

export default function GensetDetailCard({
  waktuCatat,
  ampere,
  voltase,
  solarTerpakai,
  durasiPakai,
  jenis,
  foto,
}: GensetDetailCardProps) {
  return (
    <div className="bg-primary rounded-xl p-4 text-white w-full max-w-full shadow-md">
      <div className="grid place-content-center my-4">
        <img
          src={foto || NoImage}
          alt=""
          className="w-48 h-48 object-cover"
          style={{ borderRadius: "1rem" }}
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold capitalize">
          Genset {`(${jenis ?? "-"})`}
        </h2>
        <div className="flex items-center bg-[#003ECF] text-white text-xs font-semibold px-3 py-1 rounded-full">
          <span className="ml-1">Catat:</span>
          <span className="ml-1 font-bold">{waktuCatat}</span>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between border-b border-white/30 pb-1">
          <span>Jumlah Ampere :</span>
          <span className="font-bold">{ampere} A</span>
        </div>
        <div className="flex justify-between border-b border-white/30 pb-1">
          <span>Jumlah Voltase :</span>
          <span className="font-bold">{voltase} V</span>
        </div>
        <div className="flex justify-between border-b border-white/30 pb-1">
          <span>Jumlah Solar Terpakai :</span>
          <span className="font-bold">{solarTerpakai} Lt</span>
        </div>
        <div className="flex justify-between">
          <span>Durasi Pakai :</span>
          <span className="font-bold">{durasiPakai} Menit</span>
        </div>
      </div>

      <button
        onClick={() => toast.success("Fitur masih dalam pengembangan")}
        className="mt-4 bg-greenCust hover:bg-greenCust/80 transition-colors text-white font-semibold py-2 w-full rounded-md flex justify-center items-center gap-2 text-sm"
      >
        Kirim Via WA
      </button>
    </div>
  );
}
