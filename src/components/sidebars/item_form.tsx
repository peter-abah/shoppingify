import { Category } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import React, { useState } from "react";
import Spinner from "../spinner";
import { useAppStore, ActiveSideBar } from "@/lib/store";
import { WithSerializedDates } from "../../../types/generic";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  note: z.string().optional(),
  imageUrl: z.union([z.string().url().optional(), z.string().default("")]),
});

export type ItemFormData = z.infer<typeof formSchema>;

const ItemForm = () => {
  const categories = useAppStore((state) => state.categories);
  const { addItem, setCurrentItem, setActiveSideBar } = useAppStore(
    (state) => state.actions
  );

  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [category, setCategory] =
    useState<WithSerializedDates<Category> | null>(null);
  const [isCategoryValid, setCategoryValidity] = useState<
    boolean | undefined
  >();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormData>({ resolver: zodResolver(formSchema) });

  // TODO: handle error state
  // Fetch categories from api
  const { data, error } = useSWR("/api/categories", fetcher, {
    onSuccess: (data) => {
      setFilteredCategories(data?.categories || []);
    },
  });

  const onSelectCategory = (category: WithSerializedDates<Category>) => {
    setCategory(category);
    setCategoryValidity(true);
  };

  const onSubmit = async (data: ItemFormData) => {
    if (category === null) {
      setCategoryValidity(false);
      return;
    }

    const item = await addItem({
      ...data,
      categoryId: category.id,
      categoryName: category.name,
    });

    // Show new item info
    setCurrentItem(item);
    setActiveSideBar(ActiveSideBar["ITEM_INFO"]);
  };

  return (
    <section
      className="sidebar px-6 md:px-11 py-4 md:py-8 h-screen overflow-y-auto grow shrink-0 
                        md:w-[24rem] fixed top-0 right-0 z-30 flex flex-col bg-[#fafafe]"
    >
      <h2 className="mb-8 text-2xl font-medium">Add a new item</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <label htmlFor="itemName" className="text-sm mb-1.5 font-medium">
            Name
          </label>
          <input
            id="itemName"
            type="text"
            placeholder="Enter a name"
            className="py-4 px-4 border-2 border-[#bdbdbd] bg-transparent rounded-xl w-full 
                        text-sm placeholder:text-sm placeholder:text-[#bdbdbd]"
            {...register("name")}
          />
          {errors.name && <small>{errors.name.message}</small>}
        </div>

        <div className="mb-6">
          <label htmlFor="itemNote" className="text-sm mb-1.5 font-medium">
            Note (optional)
          </label>
          <textarea
            id="itemNote"
            className="py-4 px-4 h-28 resize-none border-2 border-[#bdbdbd] bg-transparent 
                        rounded-xl w-full text-sm placeholder:text-sm placeholder:text-[#bdbdbd]"
            placeholder="Enter a note"
            {...register("note")}
          />
          {errors.note && <small>{errors.note.message}</small>}
        </div>

        <div className="mb-8">
          <label htmlFor="itemImage" className="text-sm mb-1.5 font-medium">
            Image (optional)
          </label>
          <input
            id="itemImage"
            type="url"
            placeholder="Enter a url"
            className="py-4 px-4 border-2 border-[#bdbdbd] bg-transparent rounded-xl w-full 
                      text-sm placeholder:text-sm placeholder:text-[#bdbdbd]"
            {...register("imageUrl")}
          />
          {errors.imageUrl && <small>{errors.imageUrl?.message}</small>}
        </div>

        <div className="mb-10">
          <p>Category</p>
          {!isCategoryValid && <small>Select a category</small>}

          <div
            className="mt-3 border-1 max-h-[11.25rem] overflow-y-auto border-[#E0E0E0] 
                        bg-white shadow-sm rounded-xl px-2 py-3"
          >
            {filteredCategories.map((c) => (
              <button
                className="w-full px-5 py-3 text-start text-lg text-[#828282] font-medium 
                          rounded-xl hover:bg-[#f2f2f2] hover:text-[#34333a]"
                key={c.id}
                type="button"
                onClick={() => onSelectCategory(c)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="z-30 flex items-center justify-center w-full gap-5">
          <button
            type="button"
            onClick={() => setActiveSideBar(ActiveSideBar["SHOPPING_LIST"])}
            className="px-6 py-4 font-bold rounded-xl"
          >
            cancel
          </button>
          <button
            type="submit"
            className="text-white bg-[#F9A109] py-4 px-6 flex items-center rounded-xl 
                        font-bold"
          >
            Save
            <Spinner loading={isSubmitting} className="ml-4 fill-white" />
          </button>
        </div>
      </form>
    </section>
  );
};

export default ItemForm;
