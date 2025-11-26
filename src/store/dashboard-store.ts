import { create } from "zustand";
import { persist } from "zustand/middleware";

type DashboardType = {
  value: string;
  label: string;
};

interface DashboardState {
  selectedDashboard: DashboardType;
  setDashboard: (type: DashboardType) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      selectedDashboard: { value: "MTR", label: "Meter Produksi" },
      setDashboard: (type) => set({ selectedDashboard: type }),
    }),
    {
      name: "dashboard-storage",
    }
  )
);
