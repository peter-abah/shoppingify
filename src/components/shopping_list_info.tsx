import Link from "next/link";
import { ShoppingList, ShoppingListState } from "@prisma/client";
import clsx from "clsx";
import { MdArrowForwardIos } from "react-icons/md";
import { WithSerializedDates } from "../../types/generic";
import DateComponent from "@/components/date";

type Props = {
  shoppingList: WithSerializedDates<ShoppingList>;
};

function ShoppingListInfo({ shoppingList }: Props) {
  const { name, updatedAt, state } = shoppingList;

  return (
    <Link
      className="flex flex-wrap gap-y-2 items-center justify-between px-4 py-3 bg-white shadow-sm md:p-5 
                rounded-xl "
      href={`/history/${shoppingList.id}`}
    >
      <p className="font-medium">{name}</p>

      <div className="flex items-center">
        <DateComponent date={updatedAt} />

        <span
          className={clsx(
            "mr-8 ml-7 border px-2 py-1 rounded-lg text-xs font-medium",
            {
              "text-[#56CCF2] border-[#56CCF2]":
                state === ShoppingListState["COMPLETED"],
              "text-[#EB5757] border-[#EB5757]":
                state === ShoppingListState["CANCELED"],
            }
          )}
        >
          {state.toLocaleLowerCase()}
        </span>

        <MdArrowForwardIos className="text-sm text-[#F9A109]" />
      </div>
    </Link>
  );
}

export default ShoppingListInfo;
