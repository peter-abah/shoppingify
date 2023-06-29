import Head from "next/head";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { prisma } from "../../prisma/prisma";
import type { Category as TCategory, Item as TItem } from "@prisma/client";
import Item from "@/components/item";
import Category from "@/components/category";
import Header from "@/components/header";
import { useAppStore } from "@/lib/store";
import { WithSerializedDates } from "../../types/generic";
import { ReactElement, useEffect } from "react";
import AppLayout from "@/components/app_layout";
import { ClientUser } from "../../types";
import useIsMounted from "@/hooks/use_is_mounted";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { props: { categories: [], items: [], user: null } };
  }

  const categories = await prisma.category.findMany({
    where: { ownerId: session.user.id },
  });
  const items = await prisma.item.findMany({
    where: { ownerId: session.user.id },
  });

  // Serialize props to convert Date object to string since Nextjs only serializes scalar values
  const props = JSON.parse(
    JSON.stringify({
      categories,
      items,
      user: { accountType: "online", ...session.user },
    })
  );
  return { props };
};

type HomeProps = {
  categories: WithSerializedDates<TCategory>[];
  items: WithSerializedDates<TItem>[];
  user?: ClientUser;
};
export default function Home({ categories, items, user }: HomeProps) {
  const isMounted = useIsMounted();
  const { initData } = useAppStore((state) => state.actions);
  const itemsFromStore = useAppStore((state) => state.items);
  const searchInput = useAppStore((state) => state.ui.searchInput);

  useEffect(() => {
    if (user?.accountType === "online") {
      initData(items, categories);
    }
  }, [initData, items, categories, user?.accountType]);

  const itemsToRender = isMounted ? itemsFromStore : items;
  const filteredItems = itemsToRender.filter((i) =>
    i.name.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())
  );
  const itemsByCategory = [...groupItemsByCategory(filteredItems).entries()];

  return (
    <>
      <Head>
        <title>Shoppinify</title>
        <meta name="description" content="Shopping list web app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="main-container">
        <Header />
        {itemsByCategory.map(([categoryId, items]) => (
          <div key={categoryId} className="md:mb-12 mb-7">
            <Category categoryId={categoryId} />
            <ol className="flex flex-wrap gap-x-2 gap-y-6 md:gap-x-5 md:gap-y-12">
              {items.map((item) => (
                <li key={item.id} className="w-fit">
                  <Item item={item} />
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

function groupItemsByCategory(items: WithSerializedDates<TItem>[]) {
  const result = new Map<string, WithSerializedDates<TItem>[]>();
  for (let item of items) {
    if (result.has(item.categoryId)) {
      result.get(item.categoryId)!.push(item);
    } else {
      result.set(item.categoryId, [item]);
    }
  }

  return result;
}
