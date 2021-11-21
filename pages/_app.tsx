import React from "react";
import { AppProps } from "next/app";
import "@styles/app.scss";
import "@styles/global.scss";
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import store from "@redux/store";
import RouteGuard from "@components/HOC/AuthGuard";
import MasterLayout from "@components/layouts/MasterLayout";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Provider store={store}>
      <RouteGuard>
        <MasterLayout>
          <Component {...pageProps} />
        </MasterLayout>
      </RouteGuard>
    </Provider>
  );
}

export default MyApp;
