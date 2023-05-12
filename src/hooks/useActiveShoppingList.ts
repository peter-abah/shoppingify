import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import { fetcher } from "../lib/fetcher";
import { ShoppingList } from "@prisma/client";
import { WithSerializedDates } from "../../types/generic";

function useActiveShoppingList() {
  const { data, isLoading, error, isValidating, mutate } = useSWRImmutable(
    "/api/shopping_lists/active",
    fetcher
  );
  const shoppingList = (data?.shoppingList ||
    null) as WithSerializedDates<ShoppingList> | null;

  return {
    shoppingList,
    isLoading,
    error,
    isValidating,
    mutate,
    isFetching: isLoading || isValidating,
  };
}

export default useActiveShoppingList;