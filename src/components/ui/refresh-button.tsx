// components/ui/refresh-button.tsx
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import React from "react";

interface RefreshButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  onClick,
  isLoading,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ArrowPathIcon
        className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
      />
      {isLoading ? "Muat ulang..." : "Refresh"}
    </button>
  );
};

export default RefreshButton;
