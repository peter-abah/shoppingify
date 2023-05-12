import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { ItemInShoppingList } from "@prisma/client";
import { useState } from "react";
import {
  MdRemove,
  MdAdd,
  MdDeleteOutline,
  MdCheckBoxOutlineBlank,
  MdOutlineCheckBox,
} from "react-icons/md";
import { useAppStore, ShoppingListUIState } from "@/lib/store";

type Props = {
  item: ItemInShoppingList;
};
function ItemInList({ item }: Props) {
  const [isEdit, setIsEdit] = useState(false);
  const listUIState = useAppStore((state) => state.activeListUIState);
  const { updateItemInActiveList } = useAppStore((state) => state.actions);

  return (
    <li className="flex items-center mb-6">
      {listUIState === ShoppingListUIState["COMPLETING"] && (
        <button
          onClick={() =>
            updateItemInActiveList({ ...item, cleared: !item.cleared })
          }
        >
          {item.cleared ? (
            <MdOutlineCheckBox className="text-2xl text-[#F9A10A]" />
          ) : (
            <MdCheckBoxOutlineBlank className="text-2xl text-[#F9A10A]" />
          )}
        </button>
      )}
      <span className="text-lg font-medium ml-4 mr-2 overflow-x-hidden whitespace-nowrap text-ellipsis">
        {item.name}
      </span>{" "}
      {isEdit ? (
        <EditItemButtons item={item} setVisibility={setIsEdit} />
      ) : (
        <button
          onClick={() => setIsEdit(true)}
          disabled={listUIState === ShoppingListUIState["COMPLETING"]}
          className="ml-auto w-16 h-8 grid place-items-center text-[#F9A10A] border-2 border-[#F9A10A] rounded-3xl text-xs"
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
  const { updateItemInActiveList, removeItemFromList } = useAppStore(
    (state) => state.actions
  );

  const ref = useRef(null);
  useOnClickOutside(ref, () => setVisibility(false));

  return (
    <div ref={ref} className="bg-white ml-auto rounded-xl flex items-center">
      <button
        onClick={() => removeItemFromList(item.itemId)}
        className="bg-[#F9A10A] text-white px-[.875rem] py-4 rounded-xl"
      >
        <MdDeleteOutline className="text-sm" />
      </button>

      <button
        disabled={item.count === 1}
        onClick={() =>
          updateItemInActiveList({ ...item, count: item.count - 1 })
        }
        className="text-[#F9A10A] pl-[.875rem] pr-2 py-4 rounded-xl"
      >
        <MdRemove className="text-sm" />
      </button>

      <small className="w-16 h-8 grid place-items-center text-[#F9A10A] border-2 border-[#F9A10A] rounded-3xl text-xs">
        {item.count} pcs
      </small>

      <button
        onClick={() =>
          updateItemInActiveList({ ...item, count: item.count + 1 })
        }
        className="text-[#F9A10A] px-2 py-4 rounded-xl"
      >
        <MdAdd className="text-sm" />
      </button>
    </div>
  );
}

export default ItemInList;
