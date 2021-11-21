import { useRouter } from "next/dist/client/router";
import React, { ReactElement, useEffect, useState } from "react";
import { API_ENDPOINT } from "src/constant/api";
import axiosService from "src/utilities/axiosService";
import { getToken } from "src/utilities/cookies";

interface Props {
  children: any;
}

export default function RouteGuard({ children }: Props): ReactElement {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [userCheckOkay, setCheckOkay] = useState(false);
  const authToken = getToken();

  //   useEffect(() => {
  //     // on initial load - run auth check
  //     // authCheck(router.asPath);

  //     // on route change start - hide page content by setting authorized to false
  //     const hideContent = () => setAuthorized(false);
  //     router.events.on("routeChangeStart", hideContent);

  //     // on route change complete - run auth check
  //     router.events.on("routeChangeComplete", authCheck);

  //     // unsubscribe from events in useEffect return function
  //     return () => {
  //       router.events.off("routeChangeStart", hideContent);
  //       router.events.off("routeChangeComplete", authCheck);
  //     };

  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  useEffect(() => {
    async function a() {
      console.log(userCheckOkay);
      const publicPaths = ["/login"];
      const path = router.asPath.split("?")[0];
      console.log(router.asPath);
      try {
        await axiosService.get(`${API_ENDPOINT}/orders`, {}).then((res) => {
          console.log(res);
          console.log("ok");
          setCheckOkay(true);
          setAuthorized(true);
        });
      } catch (err) {
        console.log(err);
        setCheckOkay(false);
        router.push({
          pathname: "/login",
        });
        //   setAuthorized(false);
      }
      //   if (!userCheckOkay) {
      //     console.log({ userCheckOkay, publicPaths, path });
      //     setAuthorized(false);
      //     console.log("123122");
      //     router.push({
      //       pathname: "/login",
      //       query: { returnUrl: router.asPath },
      //     });
      //   } else {
      //     setAuthorized(true);
      //   }
    }
    a();
  }, [userCheckOkay]);

  return (authorized || router.asPath === "/login") && children;
}
