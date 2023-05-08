import {
  ShoppingList,
  Item,
  Category,
  ShoppingListState,
  ItemInShoppingList,
} from "@prisma/client";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { ItemFormData } from "@/components/item_form";

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
  activeList: ShoppingList | null;
  activeListUIState: ShoppingListUIState;
  isListLoading: boolean;
  currentItem: Item | null;
  activeSideBar: ActiveSideBar;
  items: Item[];
  categories: Category[];
  timeoutIDToSaveList: NodeJS.Timeout | null;

  actions: {
    initData: (items: Item[], categories: Category[]) => void;
    addItem: (item: ItemData) => Promise<Item>;
    // updateItem: (item: Item) => void,
    deleteItem: (itemID: Item["id"]) => void;

    // addCategory: (category: Category) => void,
    // updateCategory: (category: Category) => void,
    // deleteCategory: (categoryID: Category["id"]) => void,

    addItemToList: (item: Item) => void;
    removeItemFromList: (itemId: string) => void;
    updateItemInActiveList: (item: ItemInShoppingList) => void;
    updateListName: (name: string) => void;
    changeListState: (listState: ShoppingListState) => void;
    saveListToDB: () => void;
    setActiveList: (shoppingList: ShoppingList | null) => void;
    setIsListLoading: (isLoading: boolean) => void;
    setCurrentItem: (item: Item | null) => void;
    setActiveSideBar: (value: ActiveSideBar) => void;
    setActiveListUIState: (value: ShoppingListUIState) => void;
  };
}

export const appStore = createStore<AppStore>()(
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

      addItemToList: (item: Item) => {
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

      updateListName: (name) => {
        if (name === "") return;

        set((state: AppStore) => {
          if (!state.activeList) return;

          state.activeList.name = name;
        });
        get().actions.saveListToDB();
      },

      changeListState: (listState) => {
        set((state: AppStore) => {
          if (!state.activeList) return;

          state.activeList.state = listState;
        });
        get().actions.saveListToDB();
      },

      setActiveList: (shoppingList) =>
        set((state: AppStore) => {
          state.activeList = shoppingList;
        }),

      saveListToDB: async () => {
        const { activeList, timeoutIDToSaveList } = get();
        if (!activeList) return;

        if (timeoutIDToSaveList) clearTimeout(timeoutIDToSaveList);

        // Save list in 5 seconds so as to batch multiple calls to function in one api call
        const newTimeoutID = setTimeout(async () => {
          // Remove ID field from api data since prisma does not allow update of ID
          // and will throw an error if invalid fielda are present
          const { id, ...listWithoutID } = activeList;

          const res = await fetch(`/api/shopping_lists/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ shoppingList: listWithoutID }),
          });

          if (!res.ok) throw res;
        }, TIMEOUT_INTERVAL_TO_SAVE_LIST);

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
);
