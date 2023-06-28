import {
  ItemInShoppingList,
  ShoppingList,
} from "@prisma/client";
import { DEFAULT, MapWithDefault } from "./map_with_default";
import dayjs from "dayjs";
import { WithSerializedDates } from "../../types/generic";

export function groupItemsByCategory(items: ItemInShoppingList[]) {
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

export function getShoppingStatistics(
  shoppingLists: (ShoppingList | WithSerializedDates<ShoppingList>)[]
) {
  const itemCountByName = new MapWithDefault<string, number>([[DEFAULT, 0]]);
  const itemCountByCategory = new MapWithDefault<string, number>([
    [DEFAULT, 0],
  ]);
  const itemCountByMonth = new MapWithDefault<string, number>([[DEFAULT, 0]]);
  let totalItemCount = 0;

  for (let shoppingList of shoppingLists) {
    for (let item of shoppingList.items) {
      totalItemCount += item.count;

      // Update item count
      let value = itemCountByName.get(item.name) + item.count;
      itemCountByName.set(item.name, value);

      // Update category count
      value = itemCountByCategory.get(item.category) + item.count;
      itemCountByCategory.set(item.category, value);

      // Update month count
      const month = dayjs(shoppingList.updatedAt).format("MMMM");
      value = itemCountByMonth.get(month) + item.count;
      itemCountByMonth.set(month, value);
    }
  }

  const result = {
    byName: [] as { name: string; percent: number }[],
    byCategory: [] as { name: string; percent: number }[],
    byMonth: [] as { name: string; items: number }[],
  };

  for (let [name, value] of itemCountByName.entries()) {
    if (name === DEFAULT) continue;

    const percent = (value / totalItemCount) * 100;
    result.byName.push({ name, percent });
  }

  for (let [name, value] of itemCountByCategory.entries()) {
    if (name === DEFAULT) continue;

    const percent = (value / totalItemCount) * 100;
    result.byCategory.push({ name, percent });
  }

  for (let [name, items] of itemCountByMonth.entries()) {
    if (name === DEFAULT) continue;

    result.byMonth.push({ name, items });
  }

  return result;
}

export const numberToMonthMap = new Map([
  [0, "January"],
  [1, "February"],
  [2, "March"],
  [3, "April"],
  [4, "May"],
  [5, "June"],
  [6, "July"],
  [7, "August"],
  [8, "September"],
  [9, "October"],
  [10, "November"],
  [11, "December"],
]);

export const monthToNumberMap = new Map([
  ["January", 0],
  ["February", 1],
  ["March", 2],
  ["April", 3],
  ["May", 4],
  ["June", 5],
  ["July", 6],
  ["August", 7],
  ["September", 8],
  ["October", 9],
  ["November", 10],
  ["December", 11],
]);

export function isObject(item: any) {
  return item && typeof item === "object" && !Array.isArray(item);
}

export function mergeDeep(target: any, ...sources: any[]): any {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}
