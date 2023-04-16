import { ReactNode } from "react";
import { useStore } from "zustand";
import { useStoreContext } from "@/lib/store_context";
import Sidebar from "@/components/sidebar";
import ShoppingList from "@/components/shopping_list";
import ItemInfo from "@/components/item_info";

type Props = {
  children: ReactNode;
};
const AppLayout = ({ children }: Props) => {
  const storeApi = useStoreContext();
  const showCurrentItem = useStore(storeApi, (state) => state.showCurrentItem);
  return (
    <>
      {children}
      <Sidebar />
      <ShoppingList />
      {showCurrentItem && <ItemInfo />}
    </>
  );
};

export default AppLayout;
