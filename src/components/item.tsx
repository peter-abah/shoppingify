import { ActiveSideBar } from "@/lib/store";
import { useAppStore } from "@/lib/store";
import { Item as ItemType } from "@prisma/client";
import { MdAdd } from "react-icons/md";
import { WithSerializedDates } from "../../types/generic";

type Props = {
  item: WithSerializedDates<ItemType>;
};

export default function Item({ item }: Props) {
  const { setCurrentItem, setActiveSideBar } = useAppStore(
    (state) => state.actions
  );

  const onClick = () => {
    setCurrentItem(item);
    setActiveSideBar(ActiveSideBar["ITEM_INFO"]);
  };

  return (
    <button
      className="flex px-4 py-3 text-left font-medium gap-4 justify-between items-center bg-white rounded-xl w-36 md:w-44"
      onClick={onClick}
    >
      <span className="text-sm md:text-base">{item.name}</span> <MdAdd className="text-neutral-300 shrink-0" />
    </button>
  );
}
