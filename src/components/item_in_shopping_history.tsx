import React from "react";
import { ItemInShoppingList } from "@prisma/client";

type Props = {
  item: ItemInShoppingList;
};

export default function IteminShoppingHistory({ item }: Props) {
  return (
    <li className="flex px-4 py-3 text-left gap-5 justify-between h-fit bg-white rounded-xl w-44">
      <span className="mr-5 font-medium">{item.name}</span>
      <span className="text-xs font-bold text-[#F9A10A] shrink-0">
        {item.count} pcs
      </span>
    </li>
  );
}
