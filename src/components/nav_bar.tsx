import {
  MdList,
  MdOutlineInsertChartOutlined,
  MdReplay,
  MdShoppingCart,
} from "react-icons/md";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { ActiveSideBar, useAppStore } from "@/lib/store";
import useWindowDimensions from "@/hooks/useWindowDimesions";
import OptionsMenu from "./options_menu";

export default function NavBar() {
  const { data: session } = useSession({ required: true });
  const activeSideBar = useAppStore((state) => state.activeSideBar);
  const { setActiveSideBar } = useAppStore((state) => state.actions);
  const { width } = useWindowDimensions();

  const toggleShoppingList = () => {
    // Only toggle shopping list for tablets and mobile phones
    if (width > 1024) return;

    if (activeSideBar === ActiveSideBar["SHOPPING_LIST"]) {
      setActiveSideBar(ActiveSideBar["NONE"]);
    } else {
      setActiveSideBar(ActiveSideBar["SHOPPING_LIST"]);
    }
  };

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
                className="w-10 h-10 rounded-full"
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
        options={[{ node: "Sign out", onClick: signOut }]}
      />

      <ol className="flex flex-col gap-10">
        <li>
          <Link href="/">
            <MdList className="text-2xl" />
          </Link>
        </li>
        <li>
          <Link href="/history">
            <MdReplay className="text-2xl" />
          </Link>
        </li>
        <li>
          <Link href="/statistics">
            <MdOutlineInsertChartOutlined className="text-2xl" />
          </Link>
        </li>
      </ol>

      <button
        onClick={toggleShoppingList}
        className="w-10 h-10 grid place-items-center bg-[#F9A109] rounded-full"
      >
        <MdShoppingCart className="text-2xl text-white" />
        <span className="sr-only">Toggle shopping list visibility</span>
      </button>
    </nav>
  );
}
