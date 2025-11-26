export type FinishedTaskResponse = {
  success: boolean;
  message: string;
  data: {
    jumlah_catat: string; // e.g., "4/6"
    persentase_catat: string; // e.g., "66.67"
  };
};
