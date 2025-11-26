import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useDashboardStore } from "../store/dashboard-store";
import { useQuery } from "@tanstack/react-query";
import { fetchRefKodeQuery } from "../queries/dashboard/fetch-kode-trans";

export type Option = {
  label: string;
  value: string;
  kode: string;
};
const DropdownDashboard = () => {
  const { data: options } = useQuery(fetchRefKodeQuery());
  const { selectedDashboard, setDashboard } = useDashboardStore();
  const [open, setOpen] = useState(false);

  const selected =
    options?.data.find((opt) => opt.kode === selectedDashboard.value)?.nama ||
    "";
  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 pt-2 rounded-lg bg-whiteCust focus:outline-none"
      >
        <span className="font-semibold text-gray-800">{selected}</span>
        <ChevronDownIcon
          className={`w-8 h-8 text-gray-500 transform transition-transform duration-200 ease-in-out ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {open && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg h-48 overflow-auto">
          {options?.data?.map((option) => (
            <li
              key={option.kode}
              onClick={() => {
                setDashboard({ value: option.kode, label: option.nama });
                setOpen(false);
              }}
              className="px-4 py-2 font-semibold text-gray-800 cursor-pointer hover:bg-gray-100"
            >
              {option.nama}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownDashboard;
