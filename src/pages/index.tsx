import type { GetStaticProps } from "next";
import type { DataContext } from "~/client/context";
import { dataContext } from "~/client/context";
import { buildInfo } from "~/data/buildInfo";
import { materialsData } from "~/data/materials";
import type { PageMeta } from "~/schema/PageMetaSchema";

type PageProps = DataContext & PageMeta;

export default function HomePage({ materials, info }: PageProps) {
  return (
    <dataContext.Provider value={{ materials, info }}>
      <h1>Foobar</h1>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia,
      temporibus? Distinctio veniam, placeat assumenda similique modi mollitia
      eligendi temporibus ex eum nisi delectus autem blanditiis quo consequuntur
      impedit doloremque natus.
    </dataContext.Provider>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const [materials, info] = await Promise.all([
    materialsData.read(),
    buildInfo.read()
  ]);

  return {
    props: {
      materials,
      info,
      meta: {
        title: "FGO Manager",
        description: "This page should not be publically accessible"
      }
    }
  };
};
