import type { ItemInShoppingList } from "@prisma/client";
import { useStore } from "zustand";
import { useStoreContext } from "@/lib/store_context";
import { MdEdit } from "react-icons/md";
import Spinner from "./spinner";
import { ActiveSideBar, ShoppingListUIState } from "@/lib/store";
import ItemInList from "./item_in_list";
import { useState } from "react";

export default function ShoppingList() {
  const storeApi = useStoreContext();
  const shoppingList = useStore(storeApi, (state) => state.activeList);
  const uiState = useStore(storeApi, (state) => state.activeListUIState);
  const isListLoading = useStore(storeApi, (state) => state.isListLoading);
  const { setActiveSideBar, setActiveListUIState } = useStore(
    storeApi,
    (state) => state.actions
  );

  const itemsByCategory: ReturnType<typeof groupItemsByCategory> = shoppingList
    ? groupItemsByCategory(shoppingList.items)
    : new Map();

  const toggleUIState = () => {
    const value =
      uiState == ShoppingListUIState["COMPLETING"]
        ? ShoppingListUIState["EDITING"]
        : ShoppingListUIState["COMPLETING"];
    setActiveListUIState(value);
  };

  return (
    <div className="bg-[#FFF0DE] px-10 h-screen overflow-y-auto grow shrink-0 w-[24rem] fixed top-0 right-0 z-10 flex flex-col">
      <div className="py-4 px-7 bg-[#80485B] my-11 text-white rounded-xl">
        <p className="font-bold max-w-[10rem] mb-3.5">
          Didn’t find what you need?
        </p>
        <button
          onClick={() => setActiveSideBar(ActiveSideBar["ITEM_FORM"])}
          className="py-2.5 px-7 bg-white text-black text-sm font-bold rounded-xl"
        >
          Add Item
        </button>
      </div>

      {isListLoading && (
        <Spinner
          loading={isListLoading}
          className="fill-black m-auto w-8 h-8"
        />
      )}

      {!shoppingList && !isListLoading && (
        <div className="grow grid place-items-center bg-[url('/shopping_cart.svg')] bg-no-repeat bg-bottom">
          <p className="w-fit text-xl font-bold">
            Error occured while loading shopping list
          </p>
        </div>
      )}

      {shoppingList &&
        (shoppingList?.items.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold mb-10 flex items-center">
              <span>{shoppingList.name}</span>
              <button onClick={toggleUIState} className="ml-auto">
                <MdEdit className="text-lg" />
              </button>
            </h2>

            {Array.from(itemsByCategory.keys()).map((category) => (
              <div className="mb-12" key={category}>
                <h3 className="text-sm text-[#828282] mb-6 font-medium">
                  {category}
                </h3>
                <ol>
                  {itemsByCategory.get(category)!.map((item) => (
                    <ItemInList
                      item={item}
                      key={item.itemId}
                    />
                  ))}
                </ol>
              </div>
            ))}
          </>
        ) : (
          <div className="grow grid place-items-center bg-[url('/shopping_cart.svg')] bg-no-repeat bg-bottom">
            <p className="w-fit text-xl font-bold">No items</p>
          </div>
        ))}
    </div>
  );
}

function groupItemsByCategory(items: ItemInShoppingList[]) {
  const result = new Map<string, ItemInShoppingList[]>();
  for (let item of items) {
    if (result.has(item.category)) {
      result.get(item.category)!.push(item);
    } else {
      result.set(item.category, [item]);
    }
  }

  return result;
}
