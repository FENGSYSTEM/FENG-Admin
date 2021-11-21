import Cookies from "js-cookie";

export const getToken = () => {
  return Cookies.get("token") || null;
};
export const setUserCookie = (token: any) => {
  Cookies.set("token", token, { expires: 7 });
};
