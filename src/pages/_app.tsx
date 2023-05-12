import "../styles/globals.css";

import type { AppProps } from "next/app";
import type { NextPage } from "next";
import { SessionProvider, useSession } from "next-auth/react";
import { ReactElement } from "react";
import AppLayout from "@/components/app_layout";

export type NextPageWithAuth<P = {}, IP = P> = NextPage<P, IP> & {
  auth?: boolean;
};

type AppPropsWithAuth = AppProps & {
  Component: NextPageWithAuth;
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithAuth) {
  return (
    <SessionProvider session={session}>
      <AppLayout>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </AppLayout>
    </SessionProvider>
  );
}

function Auth({ children }: { children: ReactElement }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}
