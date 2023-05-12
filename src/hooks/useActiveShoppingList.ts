import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import { ShoppingList } from "@prisma/client";
import { WithSerializedDates } from "../../types/generic";

function useActiveShoppingList() {
  const { data, isLoading, error } = useSWR(
    "/api/shopping_lists/active",
    fetcher
  );
  const shoppingList = (data?.shoppingList ||
    null) as WithSerializedDates<ShoppingList> | null;
  
  console.log({shoppingList})
  return { shoppingList, isLoading, error };
}

export default useActiveShoppingList;
