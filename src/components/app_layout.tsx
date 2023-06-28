import React, { ReactNode, useEffect } from "react";
import { Quicksand } from "next/font/google";
import dynamic from "next/dynamic";
import NavBar from "@/components/nav_bar";
import ItemInfo from "@/components/sidebars/item_info";
import ItemForm from "@/components/sidebars/item_form";
import { useAppStore, ActiveSideBar } from "@/lib/store";
import useWindowDimensions from "@/hooks/use_window_dimensions";
import useAuth from "@/hooks/use_auth";

// Import shopping list component as client side only
const ShoppingList = dynamic(
  () => import("@/components/sidebars/shopping_list"),
  {
    ssr: false,
  }
);

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

type Props = {
  children: ReactNode;
};
const AppLayout = ({ children }: Props) => {
  useAuth();
  const activeSideBar = useAppStore((state) => state.ui.activeSideBar);
  const { setActiveSideBar } = useAppStore((state) => state.actions);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (width < 1024) {
      setActiveSideBar(ActiveSideBar["NONE"]);
    }
  }, [width, setActiveSideBar]);

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
