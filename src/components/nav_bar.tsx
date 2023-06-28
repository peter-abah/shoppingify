import React from "react";
import {
  MdList,
  MdOutlineInsertChartOutlined,
  MdReplay,
  MdShoppingCart,
} from "react-icons/md";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { ActiveSideBar, useAppStore } from "@/lib/store";
import useWindowDimensions from "@/hooks/use_window_dimensions";
import OptionsMenu from "./options_menu";
import { useRouter } from "next/router";
import clsx from "clsx";
import { resetLocalAccount } from "@/lib/client";

export default function NavBar() {
  const { data: session } = useSession();
  const activeSideBar = useAppStore((state) => state.ui.activeSideBar);
  const { setActiveSideBar, resetStoreState } = useAppStore(
    (state) => state.actions
  );
  const { width } = useWindowDimensions();
  const router = useRouter();

  const toggleShoppingList = () => {
    // Only toggle shopping list for tablets and mobile phones
    if (width > 1024) return;

    if (activeSideBar === ActiveSideBar["SHOPPING_LIST"]) {
      setActiveSideBar(ActiveSideBar["NONE"]);
    } else {
      setActiveSideBar(ActiveSideBar["SHOPPING_LIST"]);
    }
  };

  const resetAndSignOut = () => {
    resetStoreState();
    signOut();
  };

  const options = session
    ? [{ node: "Sign out", onClick: resetAndSignOut }]
    : [{ node: "Reset account", onClick: resetLocalAccount }];

  return (
    <nav
      className="md:w-24 w-16 h-screen flex flex-col bg-white items-center py-9 
                    justify-between fixed top-0 left-0"
    >
      <OptionsMenu
        menuButton={
          <button>
            {session?.user?.image ? (
              <img
                className="w-10 h-10 rounded-full hover:scale-110"
                src={session.user.image}
                alt={session.user.name!}
              />
            ) : (
              <div className="w-10 h-10 bg-red-600 rounded-full">
                <span className="sr-only">Display picture</span>
              </div>
            )}
          </button>
        }
        options={options}
      />

      <ol className="flex flex-col gap-10 w-full items-center">
        <li
          className={clsx("w-full grid place-items-center", {
            "active-nav-link": router.pathname === "/",
          })}
        >
          <Link href="/" className="hover:scale-110">
            <MdList className="text-2xl" />
          </Link>
        </li>
        <li
          className={clsx("w-full grid place-items-center", {
            "active-nav-link": router.pathname === "/history",
          })}
        >
          <Link href="/history" className="hover:scale-110">
            <MdReplay className="text-2xl" />
          </Link>
        </li>
        <li
          className={clsx("w-full grid place-items-center", {
            "active-nav-link": router.pathname === "/statistics",
          })}
        >
          <Link href="/statistics" className="hover:scale-110">
            <MdOutlineInsertChartOutlined className="text-2xl" />
          </Link>
        </li>
      </ol>

      <button
        onClick={toggleShoppingList}
        className="w-10 h-10 grid place-items-center bg-[#F9A109] rounded-full hover:scale-110"
      >
        <MdShoppingCart className="text-2xl text-white" />
        <span className="sr-only">Toggle shopping list visibility</span>
      </button>
    </nav>
  );
}
