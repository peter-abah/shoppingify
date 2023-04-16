import { useStoreContext } from "@/lib/store_context";
import { Item as ItemType } from "@prisma/client";
import { MdAdd } from "react-icons/md";
import { useStore } from "zustand";

type Props = {
  item: ItemType;
};

export default function Item({ item }: Props) {
  const storeApi = useStoreContext();
  const addItemToList = useStore(storeApi, (state) => state.addItemToList);

  return (
    <button
      className="flex px-4 py-3 text-left font-medium gap-1.5 justify-between items-center bg-white rounded-xl w-44"
      onClick={() => addItemToList(item)}
    >
      <span>{item.name}</span> <MdAdd className="text-neutral-300 shrink-0" />
    </button>
  );
}
