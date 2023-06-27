import Head from "next/head";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { prisma } from "../../prisma/prisma";
import { ShoppingListState } from "@prisma/client";
import { getShoppingStatistics } from "@/lib/helpers";
import TopList from "@/components/top_list";
import MonthChart from "@/components/month_chart";
import { ReactElement } from "react";
import AppLayout from "@/components/app_layout";

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
  });

  const statistics = getShoppingStatistics(shoppingLists);
  return { props: { statistics } };
};

type t = typeof getServerSideProps;
type PageProps = {
  statistics: ReturnType<typeof getShoppingStatistics>;
};
export default function Page({ statistics }: PageProps) {
  console.log({ statistics });

  return (
    <>
      <Head>
        <title>Shoppinify | Statistics</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="main-container">
        <div className="flex justify-between gap-x-16 gap-y-8 mt-14 mb-16 mx-auto w-full flex-wrap max-w-screen-md">
          <TopList
            title="Top Items"
            data={statistics.byName.slice(0, 3)}
            ui={{ itemColor: "#F9A109" }}
          />
          <TopList
            title="Top Categories"
            data={statistics.byCategory.slice(0, 3)}
            ui={{ itemColor: "#56CCF2" }}
          />
        </div>

        <MonthChart data={statistics.byMonth} />
      </div>
    </>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
