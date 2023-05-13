import { ItemInShoppingList } from "@prisma/client";

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