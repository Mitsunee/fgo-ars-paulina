import type { GetStaticProps } from "next";
import type { DataContext } from "~/client/context";
import { dataContext } from "~/client/context";
import { buildInfo } from "~/data/buildInfo";
import { materialsData } from "~/data/materials";

export default function HomePage(ctx: DataContext) {
  return (
    <dataContext.Provider value={ctx}>
      <h1>Foobar</h1>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia,
      temporibus? Distinctio veniam, placeat assumenda similique modi mollitia
      eligendi temporibus ex eum nisi delectus autem blanditiis quo consequuntur
      impedit doloremque natus.
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
