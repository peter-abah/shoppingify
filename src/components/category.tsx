import { useAppStore } from "@/lib/store";
import { Category as CategoryType } from "@prisma/client";
import { useState } from "react";
import { WithSerializedDates } from "../../types/generic";
import OptionsMenu from "./options_menu";
import Spinner from "./spinner";

type Props = {
  categoryId: string; // WithSerializedDates<CategoryType>;
};
function Category({ categoryId }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const categories = useAppStore((state) => state.categories);
  const { deleteCategory } = useAppStore((state) => state.actions);
  const category = categories.find((c) => c.id === categoryId);

  const onDelete = async () => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this category. Items in categpry will also be deleted"
    );
    if (!shouldDelete) return;

    setIsDeleting(true);
    await deleteCategory(categoryId);
    setIsDeleting(true);
  };

  return (
    <header className="mb-[18px] flex items-center justify-between">
      <h2 className="text-lg font-medium">{category?.name || "Not found"}</h2>
      {category &&
        (isDeleting ? (
          <Spinner loading={isDeleting} className="fill-black" />
        ) : (
          <OptionsMenu
            options={[
              { node: "Edit", onClick: () => null },
              { node: "Delete", onClick: onDelete },
            ]}
          />
        ))}
    </header>
  );
}

export default Category;
