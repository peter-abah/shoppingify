import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { useStoreContext } from "@/lib/store_context";
import { ItemInShoppingList } from "@prisma/client";
import { useState } from "react";
import { MdRemove, MdAdd, MdDeleteOutline } from "react-icons/md";
import { useStore } from "zustand";

type Props = {
  item: ItemInShoppingList;
};
function ItemInList({ item }: Props) {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <li className="flex justify-between items-center mb-6 gap-2">
      <span className="text-lg font-medium overflow-x-hidden whitespace-nowrap text-ellipsis">
        {item.name}
      </span>{" "}
      {isEdit ? (
        <EditItemButtons item={item} setVisibility={setIsEdit} />
      ) : (
        <button
          onClick={() => setIsEdit(true)}
          className="w-16 h-8 grid place-items-center text-[#F9A10A] border-2 border-[#F9A10A] rounded-3xl text-xs"
        >
          {item.count} pcs
        </button>
      )}
    </li>
  );
}

type EditItemButtonsProps = {
  item: ItemInShoppingList;
  setVisibility: (val: boolean) => void;
};
function EditItemButtons({ item, setVisibility }: EditItemButtonsProps) {
  const storeApi = useStoreContext();
  const { updateItemCount, removeItemFromList } = useStore(
    storeApi,
    (state) => state.actions
  );

  const ref = useRef(null);
  useOnClickOutside(ref, () => setVisibility(false));

  return (
    <div ref={ref} className="bg-white rounded-xl flex items-center">
      <button
        onClick={() => removeItemFromList(item.itemId)}
        className="bg-[#F9A10A] text-white px-[.875rem] py-4 rounded-xl"
      >
        <MdDeleteOutline className="text-sm" />
      </button>

      <button
        disabled={item.count === 1}
        onClick={() => updateItemCount(item.itemId, item.count - 1)}
        className="text-[#F9A10A] pl-[.875rem] pr-2 py-4 rounded-xl"
      >
        <MdRemove className="text-sm" />
      </button>

      <small className="w-16 h-8 grid place-items-center text-[#F9A10A] border-2 border-[#F9A10A] rounded-3xl text-xs">
        {item.count} pcs
      </small>

      <button
        onClick={() => updateItemCount(item.itemId, item.count + 1)}
        className="text-[#F9A10A] px-2 py-4 rounded-xl"
      >
        <MdAdd className="text-sm" />
      </button>
    </div>
  );
}

export default ItemInList;
