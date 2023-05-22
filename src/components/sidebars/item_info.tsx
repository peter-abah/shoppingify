import { ActiveSideBar } from "@/lib/store";
import { useAppStore } from "@/lib/store";
import { useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import Spinner from "../spinner";

const ItemInfo = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const currentItem = useAppStore((state) => state.currentItem);
  const { addItemToList, setActiveSideBar, deleteItem } = useAppStore(
    (state) => state.actions
  );

  if (!currentItem) {
    return null;
  }

  const onAddToList = () => {
    addItemToList(currentItem);
    setActiveSideBar(ActiveSideBar["SHOPPING_LIST"]);
  };

  const onDeleteItem = async () => {
    // TODO: Replace with custom modal
    const shouldDelete = window.confirm("Are you sure you want to delete item");
    if (!shouldDelete) return;

    setIsDeleting(true);
    await deleteItem(currentItem.id);
    setIsDeleting(false);
    setActiveSideBar(ActiveSideBar["SHOPPING_LIST"]);
  };

  const { name, note, imageUrl, categoryName } = currentItem;

  return (
    <div className="sidebar bg-white px-6 pt-4 md:px-11 md:pt-7 md:w-[24rem] h-[calc(100vh-8rem)] 
                    pb-4 fixed top-0 right-0 overflow-y-auto z-20">
      <button
        onClick={() => setActiveSideBar(ActiveSideBar["SHOPPING_LIST"])}
        className="flex text-[#F9A109] mb-9"
      >
        <MdKeyboardBackspace className="mr-1 text-xl" />
        <span className="text-sm font-bold">back</span>
      </button>

      {imageUrl ? (
        <img
          className="w-full h-52 rounded-3xl mb-14"
          src={imageUrl}
          alt={name}
        />
      ) : (
        <div className="w-full bg-slate-200 h-52 rounded-3xl mb-14" />
      )}

      <div className="mb-8">
        <h3 className="text-sm text-[#c1c1c4]">name</h3>
        <p className="text-2xl font-medium">{name}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-sm text-[#c1c1c4]">category</h3>
        <p className="text-lg font-medium">{categoryName}</p>
      </div>

      <div>
        <h3 className="text-sm text-[#c1c1c4]">note</h3>
        <p className="text-lg font-medium">{note || "No note"}</p>
      </div>

      <div className="flex justify-center gap-5 fixed bottom-0 right-0  md:w-[24rem] h-[8rem] 
                      items-center bg-white z-30 w-[min(calc(100vw-4rem),24rem)]">
        <button
          onClick={onDeleteItem}
          className="flex items-center px-6 py-4 font-bold rounded-xl"
        >
          <span>delete</span>
          {isDeleting && (
            <Spinner className="ml-3 fill-black" loading={isDeleting} />
          )}
        </button>
        <button
          onClick={onAddToList}
          className="text-white bg-[#F9A109] py-4 px-6 rounded-xl font-bold"
        >
          Add to list
        </button>
      </div>
    </div>
  );
};

export default ItemInfo;
