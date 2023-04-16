import { ShoppingList, Item, ShoppingListState } from "@prisma/client";
import { is } from "immer/dist/internal";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface AppStore {
  activeList: ShoppingList | null;
  isListLoading: boolean;
  currentItem: Item | null;
  showCurrentItem: boolean;
  addItemToList: (item: Item) => void;
  removeItemFromList: (itemId: string) => void;
  updateItemCount: (itemId: string, count: number) => void;
  updateListName: (name: string) => void;
  changeListState: (listState: ShoppingListState) => void;
  saveList: () => void;
  setActiveList: (shoppingList: ShoppingList | null) => void;
  setIsListLoading: (isLoading: boolean) => void;
  setCurrentItem: (item: Item | null) => void;
  setShowCurrentItem: (value: boolean) => void;
}

export const appStore = createStore<AppStore>()(
  immer((set, get) => ({
    activeList: null,
    isListLoading: false,
    currentItem: null,
    showCurrentItem: false,

    addItemToList: (item) => {
      // increment count if item already in list
      let itemFromSearch = get().activeList?.items.find(
        (i) => i.itemId == item.id
      );
      if (itemFromSearch) {
        get().updateItemCount(item.id, itemFromSearch.count + 1);
        return;
      }

      const itemInList = {
        ...item,
        count: 1,
        cleared: false,
        category: item.categoryName,
        itemId: item.id,
      };
      set((state: AppStore) => {
        state.activeList?.items.push(itemInList);
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

    setShowCurrentItem: (value) => {
      set({ showCurrentItem: value });
    },
  }))
);
