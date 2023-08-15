import "modern-normalize/modern-normalize.css";
import "~/styles/app.css";

import { useEffect } from "react";
import type { AppType } from "next/app";
import { Inter, Kanit } from "next/font/google";
import Head from "next/head";
//import { api } from "~/client/api";
//import { Layout } from "~/components/Layout";
import { setIsClient } from "~/hooks/useIsClient";

const fontTitle = Kanit({
  weight: ["400", "700"],
  style: "normal",
  subsets: ["latin"],
  display: "swap"
});

const fontSans = Inter({
  weight: ["400", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap"
});

const App: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // set isClient
    setIsClient();
  }, []);

  return (
    <>
      <Head>
        <title>FGO Manager</title>
        <meta
          name="description"
          content={"This site is still in development :)"}
        />
        <meta
          name="twitter:description"
          content={"This site is still in development :)"}
        />
        <meta
          property="og:description"
          content={"This site is still in development :)"}
        />
      </Head>
      <style jsx global>
        {`
          :root {
            --sans: ${fontSans.style.fontFamily};
            --title: ${fontTitle.style.fontFamily};
          }
        `}
      </style>
      <Component {...pageProps} />
    </>
  );
};

export default App;
//export default api.withTRPC(App);
