import "modern-normalize/modern-normalize.css";
import "~/styles/app.css";

import { useEffect } from "react";
import type { AppType } from "next/app";
import { Inter, Kanit } from "next/font/google";
import Head from "next/head";
//import { api } from "~/client/api";
//import { Layout } from "~/components/Layout";
import { setIsClient } from "~/hooks/useIsClient";
import { PageMetaSchema } from "~/schema/PageMetaSchema";

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

  const { meta } = PageMetaSchema.parse(pageProps);

  /*
      <Layout>
        <Component {...pageProps} />
      </Layout>
   */

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="twitter:description" content={meta.description} />
        <meta property="og:description" content={meta.description} />
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
