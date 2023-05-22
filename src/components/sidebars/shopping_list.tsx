import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ItemInShoppingList, ShoppingListState } from "@prisma/client";
import clsx from "clsx";
import { MdEdit } from "react-icons/md";
import Spinner from "../spinner";
import { useAppStore, ActiveSideBar, ShoppingListUIState } from "@/lib/store";
import ItemInList from "../item_in_list";
import useActiveShoppingList from "@/hooks/useActiveShoppingList";
import { KeyedMutator } from "swr";
import { groupItemsByCategory } from "@/lib/helpers";

export default function ShoppingList() {
  const { shoppingList, isFetching, mutate } = useActiveShoppingList();
  const activeList = useAppStore((state) => state.activeList);
  const uiState = useAppStore((state) => state.activeListUIState);
  const { setActiveList, setActiveSideBar, setActiveListUIState } = useAppStore(
    (state) => state.actions
  );

  // Update active list only if the value from hook is an updated version
  useEffect(() => {
    if (
      (activeList &&
        shoppingList &&
        new Date(shoppingList.updatedAt) > new Date(activeList.updatedAt)) ||
      activeList == null
    ) {
      setActiveList(shoppingList);
    }
  }, [activeList?.updatedAt, shoppingList?.updatedAt]);

  const itemsByCategory: ReturnType<typeof groupItemsByCategory> = activeList
    ? groupItemsByCategory(activeList.items)
    : new Map();

  const toggleUIState = () => {
    const value =
      uiState == ShoppingListUIState["COMPLETING"]
        ? ShoppingListUIState["EDITING"]
        : ShoppingListUIState["COMPLETING"];
    setActiveListUIState(value);
  };

  return (
    <div className="sidebar bg-[#FFF0DE] px-4 md:px-10 pb-36 h-screen overflow-y-auto grow shrink-0 w-[24rem] 
                    fixed md:left-auto top-0 right-0 z-10 flex flex-col">
      <div className="py-4 px-4 bg-[#80485B] my-11 text-white rounded-xl">
        <p className="font-bold max-w-[10rem] mb-3.5">
          Didn’t find what you need?
        </p>
        <button
          onClick={() => setActiveSideBar(ActiveSideBar["ITEM_FORM"])}
          className="py-2.5 px-7 bg-white text-black text-sm font-bold rounded-xl"
        >
          Add Item
        </button>
      </div>

      {isFetching && (
        <Spinner loading={isFetching} className="fill-black m-auto w-8 h-8" />
      )}

      {!activeList && !isFetching && (
        <div className="grow grid place-items-center bg-[url('/shopping_cart.svg')] bg-no-repeat 
                        bg-bottom">
          <p className="w-fit text-xl font-bold">
            Error occured while loading shopping list
          </p>
        </div>
      )}

      {!isFetching &&
        activeList &&
        (activeList?.items.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold mb-10 flex items-center">
              <span>{activeList.name}</span>
              <button onClick={toggleUIState} className="ml-auto">
                <MdEdit className="text-lg" />
              </button>
            </h2>

            {Array.from(itemsByCategory.keys()).map((category) => (
              <div className="mb-12" key={category}>
                <h3 className="text-sm text-[#828282] mb-6 font-medium">
                  {category}
                </h3>
                <ol>
                  {itemsByCategory.get(category)!.map((item) => (
                    <ItemInList item={item} key={item.itemId} />
                  ))}
                </ol>
              </div>
            ))}
          </>
        ) : (
          <div className="grow grid place-items-center bg-[url('/shopping_cart.svg')] bg-no-repeat 
                          bg-bottom">
            <p className="w-fit text-xl font-bold">No items</p>
          </div>
        ))}

      {uiState === ShoppingListUIState["EDITING"] ||
      !activeList ||
      activeList.items.length === 0 ? (
        <NameForm />
      ) : (
        <Buttons mutate={mutate} />
      )}
    </div>
  );
}

function NameForm() {
  const shoppingList = useAppStore((state) => state.activeList);
  const { setListName } = useAppStore((state) => state.actions);
  const { register, reset, handleSubmit } = useForm<{ name: string }>();

  const isFormDisabled = !shoppingList || shoppingList.items.length === 0;

  const inputClassName = clsx(
    "bg-white border-2 focus:outline-none rounded-xl px-6 pr-24 py-4 w-full font-sm",
    { "border-[#F9A109]": !isFormDisabled, "border-[#C1C1C4]": isFormDisabled }
  );

  const buttonClassName = clsx(
    `absolute bottom-0 top-0 right-0 px-4 text-white rounded-xl font-bold 
      placeholder:text-[#BDBDBD]`,
    { "bg-[#F9A109]": !isFormDisabled, "bg-[#C1C1C4]": isFormDisabled }
  );

  const onSubmit = ({ name }: { name: string }) => {
    setListName(name);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white fixed w-[min(calc(100vw-4rem),24rem)] md:w-[24rem] bottom-0 right-0 p-4 md:px-10 
                  md:py-8"
    >
      <fieldset disabled={isFormDisabled}>
        <div className="relative">
          <label className="sr-only" htmlFor="listName">
            Name
          </label>
          <input
            type="text"
            className={inputClassName}
            placeholder="Enter a name"
            {...register("name")}
          />
          <button className={buttonClassName} type="submit">
            Save
          </button>
        </div>
      </fieldset>
    </form>
  );
}

type ButtonsProps = { mutate: KeyedMutator<any> };
function Buttons({ mutate }: ButtonsProps) {
  const [isCanceling, setIsCanceling] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const { setListState } = useAppStore((state) => state.actions);

  const handleCancel = async () => {
    // TODO: replace with a modal
    const shouldCancel = window.confirm(
      "Are you sure you want to cancel the list"
    );
    if (!shouldCancel) return;

    setIsCanceling(true);
    await setListState(ShoppingListState["CANCELED"]);
    setIsCanceling(false);

    // Fetch new active list
    mutate();
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    await setListState(ShoppingListState["COMPLETED"]);
    setIsCompleting(false);

    // Fetch new list
    mutate();
  };
  return (
    <div className="flex justify-center gap-5 fixed bottom-0 right-0 w-[min(calc(100vw-4rem),24rem)] 
                    md:w-[24rem] h-[8rem] items-center bg-white z-30">
      <button
        onClick={handleCancel}
        className="py-4 flex items-center px-6 rounded-xl font-bold"
      >
        <span>cancel</span>
        {isCanceling && (
          <Spinner className="fill-black ml-3" loading={isCanceling} />
        )}
      </button>
      <button
        onClick={handleComplete}
        className="flex items-center text-white bg-[#56CCF2] py-4 px-6 rounded-xl font-bold"
      >
        <span>Complete</span>
        {isCompleting && (
          <Spinner className="fill-white ml-3" loading={isCompleting} />
        )}
      </button>
    </div>
  );
}
