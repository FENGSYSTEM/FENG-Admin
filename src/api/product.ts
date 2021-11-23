import axios from "axios";
import { API_ENDPOINT } from "src/constant/api";

export const apiGetCategory = async () => {
  const res = await axios
    .get(`${API_ENDPOINT}/categories`)
    .then((res) => res.data);
  //   console.log(res.data);
  return res;
};

export const apiGetSubCategory = async (type: string) => {
  const res = await axios
    .get(`${API_ENDPOINT}/categories/${type}`)
    .then((res) => res.data);
  return res;
};
