import { createContext, ReactNode, useEffect, useContext } from "react";
import { appStore } from "@/lib/store";
import { ShoppingList as ShoppingListType } from "@prisma/client";

type AppStore = typeof appStore;
const StoreContext = createContext<AppStore | null>(null);

type Props = {
  children: ReactNode;
};

const defaultList: ShoppingListType = {
  name: "Shopping List",
  id: "1",
  createdAt: new Date(2022222),
  state: "ACTIVE",
  ownerId: "1",
  items: [] //allItems as Required<ItemInShoppingList>[],
};

export const StoreContextProvider = ({ children }: Props) => {
  useEffect(() => {
    // Set active list on page load
    appStore.getState().setActiveList(defaultList);
  }, []);

  return (
    <StoreContext.Provider value={appStore}>{children}</StoreContext.Provider>
  );
};

export function useStoreContext() {
  return useContext(StoreContext);
}
