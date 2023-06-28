import {
  Category,
  Item,
  ShoppingList,
  ShoppingListState,
} from "@prisma/client";
import { nanoid } from "nanoid";
import { useAppStore } from "./store";
import { WithSerializedDates } from "../../types/generic";
import { ItemData } from "../../types";

export function createDefaultDataForClient() {
  const nowDate = new Date().toISOString();
  const categories: Record<string, WithSerializedDates<Category>> = {
    food: {
      name: "Food and Vegetables",
      id: nanoid(),
      createdAt: nowDate,
      updatedAt: nowDate,
      ownerId: "",
    },
    meat: {
      name: "Meat and Fish",
      id: nanoid(),
      createdAt: nowDate,
      updatedAt: nowDate,
      ownerId: "",
    },
    beverage: {
      name: "Beverages",
      id: nanoid(),
      createdAt: nowDate,
      updatedAt: nowDate,
      ownerId: "",
    },
  };

  const items: WithSerializedDates<Item>[] = [
    {
      name: "Avocado",
      id: nanoid(),
      categoryId: categories.food.id,
      categoryName: categories.food.name,
      note: "",
      imageUrl: "",
      createdAt: nowDate,
      updatedAt: nowDate,
      ownerId: "",
    },
    {
      name: "Banana",
      id: nanoid(),
      categoryId: categories.food.id,
      categoryName: categories.food.name,
      note: "",
      imageUrl: "",
      createdAt: nowDate,
      updatedAt: nowDate,
      ownerId: "",
    },
    {
      name: "Bunch of Carrots",
      id: nanoid(),
      categoryId: categories.food.id,
      categoryName: categories.food.name,
      note: "",
      imageUrl: "",
      createdAt: nowDate,
      updatedAt: nowDate,
      ownerId: "",
    },
    {
      name: "Watermelon",
      id: nanoid(),
      categoryId: categories.food.id,
      categoryName: categories.food.name,
      note: "",
      imageUrl: "",
      createdAt: nowDate,
      updatedAt: nowDate,
      ownerId: "",
    },
    {
      name: "Pepper",
      id: nanoid(),
      categoryId: categories.food.id,
      categoryName: categories.food.name,
      note: "",
      imageUrl: "",
      createdAt: nowDate,
      updatedAt: nowDate,
      ownerId: "",
    },
    {
      name: "Chicken 1kg",
      id: nanoid(),
      categoryId: categories.meat.id,
      categoryName: categories.meat.name,
      note: "",
      imageUrl: "",
      createdAt: nowDate,
      updatedAt: nowDate,
      ownerId: "",
    },
    {
      name: "Salmon",
      id: nanoid(),
      categoryId: categories.meat.id,
      categoryName: categories.meat.name,
      note: "",
      imageUrl: "",
      createdAt: nowDate,
      updatedAt: nowDate,
      ownerId: "",
    },
    {
      name: "Beef 1kg",
      id: nanoid(),
      categoryId: categories.meat.id,
      categoryName: categories.meat.name,
      note: "",
      imageUrl: "",
      createdAt: nowDate,
      updatedAt: nowDate,
      ownerId: "",
    },
    {
      name: "Lucozade boost can pack",
      id: nanoid(),
      categoryId: categories.beverage.id,
      categoryName: categories.beverage.name,
      note: "",
      imageUrl: "",
      createdAt: nowDate,
      updatedAt: nowDate,
      ownerId: "",
    },
    {
      name: "Cocacola drink pack",
      id: nanoid(),
      categoryId: categories.beverage.id,
      categoryName: categories.beverage.name,
      note: "",
      imageUrl: "",
      createdAt: nowDate,
      updatedAt: nowDate,
      ownerId: "",
    },
  ];

  return { categories: Object.values(categories), items };
}

export function createLocalAccount() {
  useAppStore.getState().actions.resetStoreState();

  const { categories, items } = createDefaultDataForClient();
  useAppStore.setState({
    categories,
    items,
    user: { accountType: "local", id: "" },
  });
}

export function resetLocalAccount() {
  useAppStore.getState().actions.resetStoreState();
}

export function createDefaultShoppingList(): WithSerializedDates<ShoppingList> {
  const nowDate = new Date().toISOString();
  return {
    id: nanoid(),
    name: "Shopping List",
    state: ShoppingListState["ACTIVE"],
    createdAt: nowDate,
    updatedAt: nowDate,
    ownerId: "",
    items: [],
  };
}

export const itemClientActions = {
  create(itemData: ItemData): WithSerializedDates<Item> {
    const nowDate = new Date().toISOString();
    return {
      ...itemData,
      id: nanoid(),
      ownerId: "",
      createdAt: nowDate,
      updatedAt: nowDate,
      note: itemData.note || "",
      imageUrl: itemData.imageUrl || "",
    };
  },
};

export const categoryClientActions = {
  create(categoryName: string): WithSerializedDates<Category> {
    const nowDate = new Date().toISOString();
    return {
      id: nanoid(),
      name: categoryName,
      ownerId: "",
      createdAt: nowDate,
      updatedAt: nowDate,
    };
  },

  update(
    category: WithSerializedDates<Category>,
    name: string
  ): WithSerializedDates<Category> {
    const nowDate = new Date().toISOString();
    return {
      ...category,
      name,
      updatedAt: nowDate,
    };
  },
};
