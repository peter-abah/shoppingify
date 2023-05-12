import {
  ShoppingList,
  Item,
  Category,
  ShoppingListState,
  ItemInShoppingList,
} from "@prisma/client";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { ItemFormData } from "@/components/item_form";
import { WithSerializedDates } from "../../types/generic";

export enum ActiveSideBar {
  NONE,
  SHOPPING_LIST,
  ITEM_FORM,
  ITEM_INFO,
}

export enum ShoppingListUIState {
  COMPLETING,
  EDITING,
}

type ItemData = ItemFormData & {
  categoryId: Category["id"];
  categoryName: Category["name"];
};

const TIMEOUT_INTERVAL_TO_SAVE_LIST = 5000;

export interface AppStore {
  activeList: WithSerializedDates<ShoppingList> | null;
  activeListUIState: ShoppingListUIState;
  isListLoading: boolean;
  currentItem: WithSerializedDates<Item> | null;
  activeSideBar: ActiveSideBar;
  items: WithSerializedDates<Item>[];
  categories: WithSerializedDates<Category>[];
  timeoutIDToSaveList: number | null;

  actions: {
    initData: (
      items: WithSerializedDates<Item>[],
      categories: WithSerializedDates<Category>[]
    ) => void;
    addItem: (item: ItemData) => Promise<WithSerializedDates<Item>>;
    deleteItem: (itemID: Item["id"]) => void;
    addItemToList: (item: WithSerializedDates<Item>) => void;
    removeItemFromList: (itemId: string) => void;
    updateItemInActiveList: (item: ItemInShoppingList) => void;
    saveListToDB: (
      shoppingList?: WithSerializedDates<ShoppingList>,
      timeOutInterval?: number
    ) => Promise<void>;
    setActiveList: (
      shoppingList: WithSerializedDates<ShoppingList> | null
    ) => void;
    setListName: (name: string) => void;
    setListState: (listState: ShoppingListState) => Promise<void>;
    setIsListLoading: (isLoading: boolean) => void;
    setCurrentItem: (item: WithSerializedDates<Item> | null) => void;
    setActiveSideBar: (value: ActiveSideBar) => void;
    setActiveListUIState: (value: ShoppingListUIState) => void;
  };
}

export const useAppStore = create<AppStore>()(
  devtools(
    immer((set, get) => ({
      activeList: null,
      activeListUIState: ShoppingListUIState["EDITING"],
      isListLoading: true,
      currentItem: null,
      activeSideBar: ActiveSideBar["SHOPPING_LIST"],
      items: [],
      categories: [],
      timeoutIDToSaveList: null,

      actions: {
        initData: (items, categories) => {
          set({ items, categories });
        },

        addItem: async (itemData) => {
          // TODO: Move this to another function
          const res = await fetch("/api/items", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(itemData),
          });

          if (!res.ok) throw res;

          const { item } = await res.json();
          set((state: AppStore) => {
            state.items.push(item);
          });
          return item;
        },

        deleteItem: async (itemId) => {
          // Delete item in database
          const res = await fetch(`/api/items/${itemId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) throw res;

          set((state: AppStore) => {
            state.items = state.items.filter((item) => item.id !== itemId);
          });
        },

        addItemToList: (item) => {
          // increment count if item already in list
          let itemInList = get().activeList?.items.find(
            (i) => i.itemId == item.id
          );

          if (itemInList) {
            get().actions.updateItemInActiveList({
              ...itemInList,
              count: itemInList.count + 1,
            });
            get().actions.saveListToDB();
          } else {
            const itemToAdd = {
              name: item.name,
              count: 1,
              cleared: false,
              category: item.categoryName,
              itemId: item.id,
            };
            set((state: AppStore) => {
              state.activeList?.items.push(itemToAdd);
            });
          }
          get().actions.saveListToDB();
        },

        removeItemFromList: (itemId) => {
          set((state: AppStore) => {
            if (!state.activeList) return;

            state.activeList.items = state.activeList.items.filter(
              (item) => item.itemId !== itemId
            );
          });
          get().actions.saveListToDB();
        },

        updateItemInActiveList: (updatedItem) => {
          set((state: AppStore) => {
            if (!state.activeList) return;

            const index = state.activeList.items.findIndex(
              (i) => i.itemId === updatedItem.itemId
            );
            if (index === -1) return;

            state.activeList.items[index] = updatedItem;
          });
          get().actions.saveListToDB();
        },

        setListName: (name) => {
          if (name === "") return;

          set((state: AppStore) => {
            if (!state.activeList) return;

            state.activeList.name = name;
          });
          get().actions.saveListToDB();
        },

        setListState: async (listState) => {
          const { activeList } = get();
          if (!activeList) return;

          await get().actions.saveListToDB(
            { ...activeList, state: listState },
            0
          );

          set((state: AppStore) => {
            if (!state.activeList) return;

            state.activeList.state = listState;
          });
        },

        setActiveList: (shoppingList) =>
          set(
            (state: AppStore) => {
              state.activeList = shoppingList;
            },
            false,
            { type: { name: "setActiveList", shoppingList } }
          ),

        saveListToDB: async (
          shoppingList,
          timeOutInterval = TIMEOUT_INTERVAL_TO_SAVE_LIST
        ) => {
          const { activeList, timeoutIDToSaveList } = get();
          if (!activeList || !shoppingList) return;

          const listToSave = shoppingList || activeList;
          if (timeoutIDToSaveList) clearTimeout(timeoutIDToSaveList);

          const saveList = async () => {
            // Remove ID field from api data since prisma does not allow update of ID
            // and will throw an error if invalid fields are present
            const { id, ...listWithoutID } = listToSave;

            const res = await fetch(`/api/shopping_lists/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ shoppingList: listWithoutID }),
            });

            if (!res.ok) throw res;
          }

          let newTimeoutID;
          if (timeOutInterval === 0) {
            await saveList();
            newTimeoutID = null;
          } else {
            newTimeoutID = window.setTimeout(saveList, timeOutInterval);
          }

          set({ timeoutIDToSaveList: newTimeoutID });
        },

        setIsListLoading: (isListLoading) => {
          set({ isListLoading });
        },

        setCurrentItem: (item) => {
          set({ currentItem: item });
        },

        setActiveSideBar: (value) => {
          set({ activeSideBar: value });
        },

        setActiveListUIState: (value) => {
          set({ activeListUIState: value });
        },
      },
    }))
  )
);
