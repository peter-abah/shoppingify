import { useAppStore } from "@/lib/store";
import { Category as CategoryType } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdCheck, MdClose } from "react-icons/md";
import { useToggle } from "usehooks-ts";
import { WithSerializedDates } from "../../types/generic";
import ConfirmModal from "./confirm_modal";
import OptionsMenu from "./options_menu";
import Spinner from "./spinner";

type Props = {
  categoryId: string; // WithSerializedDates<CategoryType>;
};
function Category({ categoryId }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [shouldEdit, toggleShouldEdit] = useToggle(false);
  const categories = useAppStore((state) => state.categories);
  const { deleteCategory } = useAppStore((state) => state.actions);
  const category = categories.find((c) => c.id === categoryId);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onDelete = async () => {
    setIsDeleting(true);
    await deleteCategory(categoryId);
    setIsDeleting(true);
  };

  return (
    <header className="mb-[18px] flex items-center justify-between">
      {shouldEdit && category ? (
        <EditForm category={category} hideForm={toggleShouldEdit} />
      ) : (
        <>
          <h2 className="text-lg font-medium">
            {category?.name || "Not found"}
          </h2>
          {category &&
            (isDeleting ? (
              <Spinner loading={isDeleting} className="fill-black" />
            ) : (
              <OptionsMenu
                options={[
                  { node: "Edit", onClick: toggleShouldEdit },
                  { node: "Delete", onClick: () => setShowDeleteModal(true) },
                ]}
              />
            ))}
        </>
      )}
      <ConfirmModal
        text="Are you sure you want to delete this category. Items in categpry will also be deleted"
        onConfirm={onDelete}
        onCancel={() => setShowDeleteModal(false)}
        isOpen={showDeleteModal}
      />
    </header>
  );
}

type FormData = { name: string };
type FormProps = {
  category: WithSerializedDates<CategoryType>;
  hideForm: () => void;
};
function EditForm({ category, hideForm }: FormProps) {
  const { updateCategory } = useAppStore((state) => state.actions);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: { name: category.name },
  });

  const onSubmit = async ({ name }: FormData) => {
    await updateCategory(category.id, name);
    hideForm();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-between w-full"
    >
      <label htmlFor="categoryName" className="sr-only">
        Category Name
      </label>
      <input
        id="categoryName"
        className="border-b border-black pb-2 bg-transparent text-lg font-medium focus:outline-none focus:border-b-2"
        type="text"
        placeholder="Category name"
        autoFocus
        {...register("name", { required: true })}
      />

      {isSubmitting ? (
        <Spinner loading={isSubmitting} className="fill-black" />
      ) : (
        <div className="ml-auto flex items-center gap-4">
          <button type="button" className="hover:scale-125" onClick={hideForm}>
            <span className="sr-only">cancel</span>
            <MdClose className="text-xl text-red-900" />
          </button>

          <button type="submit" className="hover:scale-125">
            <span className="sr-only">Save</span>
            <MdCheck className="text-xl text-green-900" />
          </button>
        </div>
      )}
    </form>
  );
}

export default Category;
