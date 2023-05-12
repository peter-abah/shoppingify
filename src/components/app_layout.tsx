import { ReactNode } from "react";
import NavBar from "@/components/nav_bar";
import ShoppingList from "@/components/sidebars/shopping_list";
import ItemInfo from "@/components/sidebars/item_info";
import ItemForm from "@/components/sidebars/item_form";
import { useAppStore, ActiveSideBar } from "@/lib/store";

type Props = {
  children: ReactNode;
};
const AppLayout = ({ children }: Props) => {
  const activeSideBar = useAppStore((state) => state.activeSideBar);

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
    <>
      {children}
      <NavBar />
      <Sidebar />
      {}
    </>
  );
};

export default AppLayout;
