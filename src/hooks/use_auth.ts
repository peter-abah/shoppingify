import { useAppStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useIsMounted from "./use_is_mounted";

function useAuth() {
  const isMounted = useIsMounted();
  const { data: session } = useSession();
  const user = useAppStore((state) => state.user);
  const { setUser } = useAppStore((state) => state.actions);
  const router = useRouter();

  useEffect(() => {
    if (session?.user.id) {
      setUser({ accountType: "online", ...session.user });
    }
  }, [session?.user.id]);

  if (!user && !session && isMounted) {
    router.push("/sign_in");
  }
}

export default useAuth;
