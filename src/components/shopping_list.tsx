import type {
  ItemInShoppingList,
  ShoppingList as ShoppingListType,
} from "@prisma/client";
import { MdEdit } from "react-icons/md";

type Props = {
  shoppingList: ShoppingListType;
};

export default function ShoppingList({ shoppingList }: Props) {
  const { name, items } = shoppingList;
  const itemsByCategory = groupItemsByCategory(items);

  return (
    <div className="bg-[#FFF0DE] px-12 h-screen overflow-y-auto grow shrink-0 max-w-sm fixed top-0 right-0">
      <div className="py-4 px-7 bg-[#80485B] my-11 text-white rounded-xl">
        <p className="font-bold max-w-[10rem] mb-3.5">
          Didn’t find what you need?
        </p>
        <button className="py-2.5 px-7 bg-white text-black text-sm font-bold rounded-xl">
          Add Item
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-10 flex items-center">
        {name} <MdEdit className="text-lg ml-auto" />
      </h2>

      {Array.from(itemsByCategory.keys()).map((category) => (
        <div className="mb-12">
          <h3 className="text-sm text-[#828282] mb-6 font-medium">
            {category}
          </h3>
          <ol>
            {itemsByCategory.get(category)!.map((item) => (
              <li className="flex justify-between items-center mb-6 gap-2">
                <span className="text-lg font-medium">{item.name}</span>{" "}
                <button className="w-16 h-8 grid place-items-center text-[#F9A10A] border-2 border-[#F9A10A] rounded-3xl text-xs">{item.count} pcs</button>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

function groupItemsByCategory(items: ItemInShoppingList[]) {
  const result = new Map<String, ItemInShoppingList[]>();
  for (let item of items) {
    if (result.has(item.category)) {
      result.get(item.category)!.push(item);
    } else {
      result.set(item.category, [item]);
    }
  }

  return result;
}
