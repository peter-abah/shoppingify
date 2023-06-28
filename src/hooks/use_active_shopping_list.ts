import useSWRImmutable from "swr/immutable";
import { fetcher } from "../lib/fetcher";
import { ShoppingList } from "@prisma/client";
import { WithSerializedDates } from "../../types/generic";
import { createDefaultShoppingList } from "@/lib/client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";

const defaultShoppingList = createDefaultShoppingList();
function useActiveShoppingList() {
  const [shoppingListInState, setShoppingList] = useState(defaultShoppingList);
  const { pushToShoppingListsHistory, setActiveList } = useAppStore(
    (state) => state.actions
  );

  const fetchNewList = () => {
    const { activeList } = useAppStore.getState();
    if (activeList) pushToShoppingListsHistory(activeList);

    setActiveList(null);
    setShoppingList(createDefaultShoppingList());
  };

  const user = useAppStore((state) => state.user);
  const isOnline = user?.accountType === "online";
  const { data, isLoading, error, isValidating, mutate } = useSWRImmutable(
    isOnline ? "/api/shopping_lists/active" : null,
    fetcher
  );

  const shoppingList = (data?.shoppingList ||
    null) as WithSerializedDates<ShoppingList> | null;

  return {
    shoppingList: isOnline ? shoppingList : shoppingListInState,
    isLoading,
    error,
    isValidating,
    fetchNewActiveList: isOnline ? mutate : fetchNewList,
    isFetching: isLoading || isValidating,
  };
}

export default useActiveShoppingList;
