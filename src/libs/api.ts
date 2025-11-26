import axios from "axios";

export const api = axios.create({
  // baseURL: "http://localhost/produksi-api",
  //   withCredentials: true,
  baseURL: "https://produksi-api.kahuripan.erpsystempdam.com/produksi-api",
});
