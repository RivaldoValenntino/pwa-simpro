type PompaDataPerjam = {
  id_pompa: string;
  nama_pompa: string;
  jam: string;
  nilai_pompa_1: string;
  nilai_pompa_2: string;
  nilai_pompa_3: string;
  nilai_pompa_4: string;
};

export type PompaAmpereDataPerjamResponses = {
  success: boolean;
  message: string;
  data: PompaDataPerjam[];
};
