export interface RefPompaItem {
  id: string;
  id_installasi: string;
  jml_pompa: string;
  nama_pompa: string;
}

export interface ListRefPompaResponse {
  success: boolean;
  message: string;
  data: RefPompaItem[];
}
