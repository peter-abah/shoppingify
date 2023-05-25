import Head from "next/head";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { prisma } from "../../../prisma/prisma";
import { ShoppingList, ShoppingListState } from "@prisma/client";
import { WithSerializedDates } from "../../../types/generic";
import dayjs from "dayjs";
import ShoppingListInfo from "@/components/shopping_list_info";

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

  const shoppingLists = await prisma.shoppingList.findMany({
    where: {
      ownerId: session.user.id,
      NOT: { state: ShoppingListState["ACTIVE"] },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Serialize props to convert Date object to string since Nextjs only serializes scalar values
  const props = JSON.parse(JSON.stringify({ shoppingLists }));
  return { props };
};

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;
export default function History({ shoppingLists }: PageProps) {
  const shoppingListsByMonth = groupShoppingListsByMonth(shoppingLists);
  return (
    <>
      <Head>
        <title>Shoppinify | History</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="main-container">
        <header className="flex justify-between my-8 md:mt-9 md:mb-14">
          <h1 className="text-[26px] max-w-md font-bold">Shopping History</h1>
        </header>

        {[...shoppingListsByMonth.entries()].map(([month, lists]) => (
          <section className="mb-14">
            <h3 className="mb-4 text-xs font-medium">{month}</h3>
            <div className="flex flex-col gap-7">
              {lists.map((shoppingList) => (
                <ShoppingListInfo shoppingList={shoppingList} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

function groupShoppingListsByMonth(
  shoppingLists: WithSerializedDates<ShoppingList>[]
) {
  const result = new Map<string, WithSerializedDates<ShoppingList>[]>();

  for (let shoppingList of shoppingLists) {
    const date = dayjs(shoppingList.updatedAt);
    const monthKey = date.format("MMMM YYYY");
    if (result.has(monthKey)) {
      result.get(monthKey)!.push(shoppingList);
    } else {
      result.set(monthKey, [shoppingList]);
    }
  }
  return result;
}
