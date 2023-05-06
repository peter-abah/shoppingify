import { ReactNode } from "react";
import { useStore } from "zustand";
import { useStoreContext } from "@/lib/store_context";
import NavBar from "@/components/nav_bar";
import ShoppingList from "@/components/shopping_list";
import ItemInfo from "@/components/item_info";
import ItemForm from "@/components/item_form";
import { ActiveSideBar } from "@/lib/store";

type Props = {
  children: ReactNode;
};
const AppLayout = ({ children }: Props) => {
  const storeApi = useStoreContext();
  const activeSideBar = useStore(storeApi, (state) => state.activeSideBar);

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
  }
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
