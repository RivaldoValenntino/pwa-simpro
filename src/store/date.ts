// store/global.ts
import { create } from "zustand";

type GlobalState = {
  tanggal_global: Date | null;
  setTanggalGlobal: (date: Date | null) => void;
};

export const useDateGlobal = create<GlobalState>((set) => ({
  tanggal_global: null,
  setTanggalGlobal: (date) => set({ tanggal_global: date }),
}));
