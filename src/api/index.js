import axios from "axios";
export const apiUrl =
  "";
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-type": "application/json",
  },
});
export default api;
