import { Item, ItemInShoppingList } from "@prisma/client";

type Props = {
  item: ItemInShoppingList;
};
function ItemInList({ item }: Props) {
  return (
    <li className="flex justify-between items-center mb-6 gap-2">
      <span className="text-lg font-medium">{item.name}</span>{" "}
      <button className="w-16 h-8 grid place-items-center text-[#F9A10A] border-2 border-[#F9A10A] rounded-3xl text-xs">
        {item.count} pcs
      </button>
    </li>
  );
}

export default ItemInList;
