import type { GetStaticProps } from "next";
import type { DataContext } from "~/client/context";
import { dataContext } from "~/client/context";
import { App } from "~/components/App";
import { buildInfo } from "~/data/buildInfo";
import { materialsData } from "~/data/materials";

export default function HomePage(ctx: DataContext) {
  return (
    <dataContext.Provider value={ctx}>
      <main>
        <noscript>
          <section className="section error">
            <h2>This App requires JavaScript</h2>
            <p>
              Your browser either does not support JavaScript or you need to
              permit this website to use scripts.
            </p>
          </section>
        </noscript>
        <App />
      </main>
      <footer>
        Made by <a href="https://www.mitsunee.com">Mitsunee</a> | “Fate/Grand
        Order” is a trademark of Notes Co., Ltd. | Game Assets © Aniplex Inc.
        used under fair use.
        <br />
        Thanks to:{" "}
        <a
          href="https://atlasacademy.io/"
          target="_blank"
          rel="noopener noreferrer">
          Atlas Academy
        </a>{" "}
        (Game Data API and Assets)
      </footer>
    </dataContext.Provider>
  );
}

export const getStaticProps: GetStaticProps<DataContext> = async () => {
  const [materials, info] = await Promise.all([
    materialsData.read(),
    buildInfo.read()
  ]);

  return { props: { materials, info } };
};
