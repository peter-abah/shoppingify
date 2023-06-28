import { useAppStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useIsMounted from "./use_is_mounted";

function useAuth() {
  const isMounted = useIsMounted();
  const {data: session} = useSession();
  const user = useAppStore(state => state.user);
  const router = useRouter();

  if (!user && !session && isMounted) {
    router.push("/sign_in");
  }
}

export default useAuth;