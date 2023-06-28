import "../styles/globals.css";

import type { AppProps } from "next/app";
import type { NextPage } from "next";
import { SessionProvider } from "next-auth/react";
import { ReactElement, ReactNode } from "react";

export type NextPageWithLayoutAndAuth<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  auth?: boolean;
};

type AppPropsWithLayoutAndAuth = AppProps & {
  Component: NextPageWithLayoutAndAuth;
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayoutAndAuth) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <SessionProvider session={session}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
}
