import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import Head from "next/head";
import { Quicksand } from "next/font/google";
import { FcGoogle } from "react-icons/fc";
import { createLocalAccount } from "@/lib/client";
import { useRouter } from "next/router";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const skipSignIn = () => {
    createLocalAccount();
    router.push("/");
  };
  return (
    <>
      <Head>
        <title>Sign in to Shoppinify</title>
        <meta name="description" content="Sign in to shoppinify" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        className={`${quicksand.variable} font-sans px-6 sm:px-20 lg:px-32`}
      >
        <header className="mt-6 mb-12">
          <h1 className="text-[26px] md:text-xl xl:text-[26px] font-bold">
            <span className="text-[#F19101]">Shoppingify </span>
          </h1>
        </header>

        <section className="w-fit mx-auto">
          <h2 className="text-2xl font-bold mb-6">Sign In</h2>
          {Object.values(providers).map((provider) => (
            <button
              className="flex py-4 px-6 sm:px-16 border border-black rounded-xl items-center font-bold hover:bg-black hover:text-white"
              key={provider.name}
              type="button"
              onClick={() => signIn(provider.id)}
            >
              <FcGoogle className="text-xl" />
              <span className="ml-4">Continue with {provider.name}</span>
            </button>
          ))}

          <button
            type="button"
            onClick={skipSignIn}
            className="flex mt-4 py-4 px-6 sm:px-16 items-center hover:underline"
          >
            Skip Create an Account
          </button>
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
