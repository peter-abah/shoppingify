import {
  ShoppingList,
  Item,
  Category,
  ShoppingListState,
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

type ItemData = ItemFormData & {
  categoryId: Category["id"];
  categoryName: Category["name"];
};

export interface AppStore {
  activeList: ShoppingList | null;
  isListLoading: boolean;
  currentItem: Item | null;
  activeSideBar: ActiveSideBar;
  items: Item[];
  categories: Category[];

  initData: (items: Item[], categories: Category[]) => void;
  addItem: (item: ItemData) => Promise<Item>;
  // updateItem: (item: Item) => void,
  // deleteItem: (itemID: Item["id"]) => void,

  // addCategory: (category: Category) => void,
  // updateCategory: (category: Category) => void,
  // deleteCategory: (categoryID: Category["id"]) => void,

  addItemToList: (item: Item) => void;
  removeItemFromList: (itemId: string) => void;
  updateItemCount: (itemId: string, count: number) => void;
  updateListName: (name: string) => void;
  changeListState: (listState: ShoppingListState) => void;
  saveList: () => void;
  setActiveList: (shoppingList: ShoppingList | null) => void;
  setIsListLoading: (isLoading: boolean) => void;
  setCurrentItem: (item: Item | null) => void;
  setActiveSideBar: (value: ActiveSideBar) => void;
}

export const appStore = createStore<AppStore>()(
  immer((set, get) => ({
    activeList: null,
    isListLoading: true,
    currentItem: null,
    activeSideBar: ActiveSideBar["SHOPPING_LIST"],
    items: [],
    categories: [],

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

    addItemToList: (item: Item) => {
      // increment count if item already in list
      let itemInList = get().activeList?.items.find((i) => i.itemId == item.id);
      if (itemInList) {
        get().updateItemCount(item.id, itemInList.count + 1);
        return;
      }

      const itemToAdd = {
        ...item,
        count: 1,
        cleared: false,
        category: item.categoryName,
        itemId: item.id,
      };
      set((state: AppStore) => {
        state.activeList?.items.push(itemToAdd);
      });
    },

    removeItemFromList: (itemId) =>
      set((state: AppStore) => {
        if (!state.activeList) return;

        state.activeList.items = state.activeList.items.filter(
          (item) => item.itemId !== itemId
        );
      }),

    updateItemCount: (itemId, count) => {
      if (count <= 0) return;

      set((state: AppStore) => {
        if (!state.activeList) return;

        const item = state.activeList.items.find((i) => i.itemId === itemId);
        if (!item) return;

        item.count = count;
      });
    },

    updateListName: (name) => {
      if (name === "") return;

      set((state: AppStore) => {
        if (!state.activeList) return;

        state.activeList.name = name;
      });
    },

    changeListState: (listState) =>
      set((state: AppStore) => {
        if (!state.activeList) return;

        state.activeList.state = listState;
      }),

    setActiveList: (shoppingList) =>
      set((state: AppStore) => {
        state.activeList = shoppingList;
      }),

    saveList: () => {
      // TODO: save cart to api route
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
  }))
);
