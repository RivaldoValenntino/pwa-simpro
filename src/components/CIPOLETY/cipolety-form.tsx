// components/CipoletyFormSection.tsx

import { CameraIcon } from "@heroicons/react/24/outline";
import type { FieldErrors, UseFormSetValue } from "react-hook-form";
import type { InsertCipoletyRequests } from "../../types/requests/cipolety/insert-cplt";

type Props = {
  title: string;
  tinggiKey: keyof InsertCipoletyRequests;
  ldKey: keyof InsertCipoletyRequests;
  photoUrl: string | null;
  onTakePhoto: () => void;
  errors: FieldErrors<InsertCipoletyRequests>;
  setValue: UseFormSetValue<InsertCipoletyRequests>;
  tinggiAwal: number;
  ldAwal: number;
};

export default function CipoletyForm({
  title,
  tinggiKey,
  ldKey,
  photoUrl,
  onTakePhoto,
  errors,
  setValue,
  tinggiAwal,
  ldAwal,
}: Props) {
  return (
    <div>
      <h2 className="text-sm font-bold text-center mb-4">{title}</h2>

      <button
        type="button"
        onClick={onTakePhoto}
        className="flex items-center justify-center w-full py-2 space-x-2 text-sm font-medium text-center text-blue-600 bg-blue-100 rounded-lg"
      >
        <CameraIcon className="w-5 h-5 mb-0.5" />
        <span className="text-center">Foto Stand</span>
      </button>

      {photoUrl ? (
        <img
          src={photoUrl}
          alt="Foto Stand"
          className="object-cover w-full mt-4 rounded-md h-96"
        />
      ) : (
        <div className="flex items-center justify-center w-full mt-4 text-sm text-gray-400 bg-gray-200 rounded-md h-36">
          Belum ada foto
        </div>
      )}

      {/* Tinggi */}
      <div className="mt-2">
        <label className="block mb-1 text-sm font-medium">Tinggi Air</label>
        <input
          type="number"
          step="any"
          defaultValue={tinggiAwal}
          onChange={(e) => {
            setValue(tinggiKey, Number(e.target.value));
          }}
          className={`w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border ${
            errors[tinggiKey]
              ? "ring-1 ring-red-500"
              : "border-gray-300 focus:ring-1 focus:ring-primary"
          } rounded-lg outline-none`}
        />
        {errors[tinggiKey] && (
          <p className="mt-1 text-xs text-red-500">
            {errors[tinggiKey]?.message as string}
          </p>
        )}
      </div>

      {/* Liter/detik */}
      <div className="mt-2">
        <label className="block mb-1 text-sm font-medium">Liter / Detik</label>
        <input
          type="number"
          step="any"
          defaultValue={ldAwal}
          onChange={(e) => {
            setValue(ldKey, Number(e.target.value));
          }}
          className={`w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border ${
            errors[ldKey]
              ? "ring-1 ring-red-500"
              : "border-gray-300 focus:ring-1 focus:ring-primary"
          } rounded-lg outline-none`}
        />
        {errors[ldKey] && (
          <p className="mt-1 text-xs text-red-500">
            {errors[ldKey]?.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
