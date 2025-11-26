import React from "react";

interface FilterButtonProps {
  activeFilter: "sudah" | "belum";
  btnDoneColor?: string;
  btnUndoneColor?: string;
  className?: string;
  onFilterChange?: (filter: "sudah" | "belum") => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  activeFilter,
  btnDoneColor = "bg-blue-600",
  btnUndoneColor = "bg-gray-400",
  className = "",
  onFilterChange,
}) => {
  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className={`w-full py-2 rounded-md text-white text-sm font-semibold transition ${
            activeFilter === "sudah" ? btnDoneColor : "bg-gray-300"
          }`}
          onClick={() => onFilterChange && onFilterChange("sudah")}
        >
          SUDAH
        </button>

        <button
          type="button"
          className={`w-full py-2 rounded-md text-white text-sm font-semibold transition ${
            activeFilter === "belum" ? btnUndoneColor : "bg-gray-300"
          }`}
          onClick={() => onFilterChange && onFilterChange("belum")}
        >
          BELUM
        </button>
      </div>
    </div>
  );
};

export default FilterButton;
