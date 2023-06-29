import {
  ShoppingList,
  Item,
  Category,
  ShoppingListState,
  ItemInShoppingList,
} from "@prisma/client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { WithSerializedDates } from "../../types/generic";
import { ClientUser, ItemData } from "../../types";
import { mergeDeep } from "./helpers";
import { categoryAPIActions, itemAPIActions } from "./api";
import { categoryClientActions, itemClientActions } from "./client";

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

const TIMEOUT_INTERVAL_TO_SAVE_LIST = 5000;

export interface AppStore {
  user: ClientUser | null;
  activeList: WithSerializedDates<ShoppingList> | null;
  items: WithSerializedDates<Item>[];
  categories: WithSerializedDates<Category>[];
  timeoutIDToSaveList: number | null;
  // Store completed or cancelled shopping lists for local user
  shoppingListsHistory: WithSerializedDates<ShoppingList>[];
  ui: {
    activeListUIState: ShoppingListUIState;
    isListLoading: boolean;
    currentItem: WithSerializedDates<Item> | null;
    activeSideBar: ActiveSideBar;
    sidebarHistory: ActiveSideBar[];
    searchInput: string;
  };
  actions: {
    initData: (
      items: WithSerializedDates<Item>[],
      categories: WithSerializedDates<Category>[]
    ) => void;
    createItem: (item: ItemData) => Promise<WithSerializedDates<Item>>;
    deleteItem: (itemID: Item["id"]) => Promise<void>;
    createCategory: (
      categoryName: string
    ) => Promise<WithSerializedDates<Category>>;
    deleteCategory: (categoryID: Category["id"]) => Promise<void>;
    updateCategory: (
      categoryID: string,
      name: string
    ) => Promise<WithSerializedDates<Category>>;
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
    addSideBarToHistory: (value: ActiveSideBar) => void;
    popFromSideBarHistory: () => ActiveSideBar | undefined;
    setSearchInput: (value: string) => void;
    pushToShoppingListsHistory: (
      list: WithSerializedDates<ShoppingList>
    ) => void;
    setShoppingListsHistory: (
      lists: WithSerializedDates<ShoppingList>[]
    ) => void;
    resetStoreState: () => void;
    setUser: (user: ClientUser) => void;
  };
}

const initialData = {
  user: null,
  activeList: null,
  items: [],
  categories: [],
  timeoutIDToSaveList: null,
  shoppingListsHistory: [],
  ui: {
    activeListUIState: ShoppingListUIState["EDITING"],
    sidebarHistory: [ActiveSideBar["SHOPPING_LIST"]],
    isListLoading: true,
    currentItem: null,
    activeSideBar: ActiveSideBar["SHOPPING_LIST"],
    searchInput: "",
  },
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialData,
        actions: {
          initData: (items, categories) => {
            set({ items, categories });
          },

          createItem: async (itemData) => {
            const { user } = get();
            const item =
              user?.accountType === "online"
                ? await itemAPIActions.create(itemData)
                : itemClientActions.create(itemData);

            set((state: AppStore) => {
              state.items.push(item);
            });

            console.log({ new: get() });
            return item;
          },

          deleteItem: async (itemID) => {
            const { user } = get();
            if (user?.accountType === "online") {
              await itemAPIActions.delete(itemID);
            }

            set((state: AppStore) => {
              state.items = state.items.filter((item) => item.id !== itemID);
            });
          },

          createCategory: async (categoryName) => {
            const { user } = get();
            const category =
              user?.accountType === "online"
                ? await categoryAPIActions.create(categoryName)
                : categoryClientActions.create(categoryName);

            set((state: AppStore) => {
              state.categories.push(category);
            });
            return category;
          },

          updateCategory: async (categoryID, categoryName) => {
            const { user, categories } = get();
            const category = categories.find((c) => c.id === categoryID);
            if (!category) return;

            const updatedCategory =
              user?.accountType === "online"
                ? await categoryAPIActions.update(categoryID, categoryName)
                : categoryClientActions.update(category, categoryName);

            set((state: AppStore) => {
              const index = state.categories.findIndex(
                (c) => c.id === updatedCategory.id
              );
              if (index === -1) return;

              state.categories[index] = updatedCategory;
            });
            return updatedCategory;
          },

          deleteCategory: async (categoryID) => {
            const { user } = get();
            if (user?.accountType === "online") {
              await categoryAPIActions.delete(categoryID);
            }

            set((state: AppStore) => {
              state.items = state.items.filter(
                (item) => item.categoryId !== categoryID
              );
              state.categories = state.categories.filter(
                (category) => category.id !== categoryID
              );
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

            set((state: AppStore) => {
              if (!state.activeList) return;

              state.activeList.state = listState;
            });

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
            const { activeList, timeoutIDToSaveList, user } = get();
            if (
              !activeList ||
              !shoppingList ||
              user?.accountType !== "online"
            ) {
              return;
            }

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
            };

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
            set((state: AppStore) => {
              state.ui.isListLoading = isListLoading;
            });
          },

          setCurrentItem: (item) => {
            set((state: AppStore) => {
              state.ui.currentItem = item;
            });
          },

          setActiveSideBar: (value) => {
            set((state: AppStore) => {
              state.ui.activeSideBar = value;

              // Clear history if there is no active sidebar
              if (value === ActiveSideBar["NONE"]) {
                state.ui.sidebarHistory = [];
              } else {
                state.ui.sidebarHistory.push(value);
              }
            });
          },

          setActiveListUIState: (value) => {
            set((state: AppStore) => {
              state.ui.activeListUIState = value;
            });
          },

          addSideBarToHistory: (value) =>
            set((state: AppStore) => {
              state.ui.sidebarHistory.push(value);
            }),

          popFromSideBarHistory: () => {
            const sidebarHistory = get().ui.sidebarHistory;
            if (sidebarHistory.length < 1) return;

            const value = sidebarHistory[sidebarHistory.length - 1];
            set((state: AppStore) => {
              state.ui.sidebarHistory.pop();
              state.ui.activeSideBar =
                state.ui.sidebarHistory[state.ui.sidebarHistory.length - 1] ||
                ActiveSideBar["NONE"];
            });
            return value;
          },

          setSearchInput: (value) => {
            set((state: AppStore) => {
              state.ui.searchInput = value;
            });
          },

          pushToShoppingListsHistory: (list) => {
            set((state: AppStore) => {
              state.shoppingListsHistory.push(list);
            });
          },

          setShoppingListsHistory: (lists) => {
            set({ shoppingListsHistory: lists });
          },

          resetStoreState: () => {
            set(initialData);
          },

          setUser: (user) => {
            set({ user });
          },
        },
      })),
      {
        name: "shoppingify-storage",
        merge: (persistedState, currentState) =>
          mergeDeep(currentState, persistedState),
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(
              ([key]) => !["ui"].includes(key)
            )
          ),
      }
    )
  )
);
