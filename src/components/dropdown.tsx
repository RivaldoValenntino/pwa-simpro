import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export type Option = {
  label: string;
  value: string;
};

type DropdownProps = {
  label?: string;
  isError?: boolean;
  options: Option[];
  selected?: Option;
  onChange?: (selected: Option) => void;
};

const Dropdown = ({
  label,
  options,
  selected,
  onChange,
  isError,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full my-2">
      {label && (
        <label className="block text-sm text-black font-semibold mb-1 mx-1">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full px-4 py-2 rounded-lg bg-white focus:outline-none border ${
          isError ? "border-red-500" : "border-gray-300"
        }`}
      >
        <span className="font-semibold text-gray-800 text-sm">
          {selected?.label || "Pilih " + label}
        </span>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {open && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onChange?.(option);
                setOpen(false);
              }}
              className="px-4 py-2 text-gray-800 cursor-pointer hover:bg-gray-100"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
