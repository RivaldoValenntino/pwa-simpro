import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export type Option = {
  label: string;
  value: string;
  kode: string;
};
const DropdownJenis = () => {
  const options = {
    data: [
      { kode: "dashboard1", nama: "Dashboard 1" },
      { kode: "dashboard2", nama: "Dashboard 2" },
      { kode: "dashboard3", nama: "Dashboard 3" },
      { kode: "dashboard3", nama: "Dashboard 4" },
      { kode: "dashboard3", nama: "Dashboard 5" },
      { kode: "dashboard3", nama: "Dashboard 6" },
    ],
  };
  const [open, setOpen] = useState(false);
  const [selectedDropdown, setSelectedDropdown] = useState<string>("");

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Jenis
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2 rounded-lg bg-white focus:outline-none"
      >
        <span className="font-semibold text-gray-800">{selectedDropdown}</span>
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
                setSelectedDropdown(option.nama);
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

export default DropdownJenis;
