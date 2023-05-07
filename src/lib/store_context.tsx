import { createContext, ReactNode, useEffect, useContext } from "react";
import useSWR from "swr";
import { fetcher } from "./fetcher";
import { appStore } from "@/lib/store";
import { ShoppingList as ShoppingListType } from "@prisma/client";

type AppStore = typeof appStore;
const StoreContext = createContext<AppStore | null>(null);

type Props = {
  children: ReactNode;
};

export const StoreContextProvider = ({ children }: Props) => {
  const { data, isLoading, error } = useSWR("/api/shopping_list", fetcher);
  const shoppingList = data?.shoppingList as
    | ShoppingListType
    | null
    | undefined;

  useEffect(() => {
    // Set active list on page load
    appStore.getState().actions.setActiveList(shoppingList || null);
    appStore.getState().actions.setIsListLoading(isLoading);
  }, [shoppingList, isLoading]);

  return (
    <StoreContext.Provider value={appStore}>{children}</StoreContext.Provider>
  );
};

export function useStoreContext() {
  return useContext(StoreContext) as AppStore;
}
