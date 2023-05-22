import Head from "next/head";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { prisma } from "../../../prisma/prisma";
import { ShoppingList, ShoppingListState } from "@prisma/client";
import { WithSerializedDates } from "../../../types/generic";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { MdKeyboardBackspace } from "react-icons/md";
import DateComponent from "@/components/date";
import { groupItemsByCategory } from "@/lib/helpers";
import IteminShoppingHistory from "@/components/item_in_shopping_history";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  const { list_id } = context.query as { list_id: string };

  const shoppingList = await prisma.shoppingList.findFirst({
    where: {
      ownerId: session.user.id,
      id: list_id,
    },
  });

  // Serialize props to convert Date object to string since Nextjs only serializes scalar values
  const props = JSON.parse(JSON.stringify({ shoppingList }));
  return { props };
};

type PageProps = {
  shoppingList: WithSerializedDates<ShoppingList> | null;
};
export default function Page({ shoppingList }: PageProps) {
  const router = useRouter();
  const itemsByCategory = shoppingList
    ? [...groupItemsByCategory(shoppingList.items).entries()]
    : [];
  return (
    <>
      <Head>
        <title>Shoppinify | {shoppingList?.name || "Not Found"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main-container">
        {shoppingList ? (
          <>
            <header className="mt-9 mb-14">
              <button
                onClick={() => router.back()}
                className="flex text-[#F9A109] mb-9"
              >
                <MdKeyboardBackspace className="mr-1 text-xl" />
                <span className="text-sm font-bold">back</span>
              </button>

              <h1 className="mt-9 mb-5 text-[26px] max-w-md font-bold">
                {shoppingList.name}
              </h1>

              <DateComponent date={shoppingList.updatedAt} />
            </header>
            <section>
              {itemsByCategory.map(([category, items]) => (
                <div key={category} className="mb-16">
                  <h3 className="mb-5 text-lg font-medium">{category}</h3>
                  <ul className="flex flex-wrap gap-5">
                    {items.map((item) => (
                      <IteminShoppingHistory key={item.itemId} item={item} />
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          </>
        ) : (
          <p>Not found</p>
        )}
      </main>
    </>
  );
}
