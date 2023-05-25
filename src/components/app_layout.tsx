import { ReactNode, useEffect } from "react";
import {Quicksand} from "next/font/google";
import NavBar from "@/components/nav_bar";
import ShoppingList from "@/components/sidebars/shopping_list";
import ItemInfo from "@/components/sidebars/item_info";
import ItemForm from "@/components/sidebars/item_form";
import { useAppStore, ActiveSideBar } from "@/lib/store";
import useWindowDimensions from "@/hooks/useWindowDimesions";

const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" });

type Props = {
  children: ReactNode;
};
const AppLayout = ({ children }: Props) => {
  const activeSideBar = useAppStore((state) => state.activeSideBar);
  const { setActiveSideBar } = useAppStore((state) => state.actions);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (width < 1024) {
      setActiveSideBar(ActiveSideBar["NONE"]);
    }
  }, []);

  const Sidebar = () => {
    switch (activeSideBar) {
      case ActiveSideBar["SHOPPING_LIST"]:
        return <ShoppingList />;
      case ActiveSideBar["ITEM_INFO"]:
        return <ItemInfo />;
      case ActiveSideBar["ITEM_FORM"]:
        return <ItemForm />;
      default:
        return null;
    }
  };
  return (
    <main className={`${quicksand.variable} font-sans`}>
      {children}
      <NavBar />
      <Sidebar />
      {}
    </main>
  );
};

export default AppLayout;
