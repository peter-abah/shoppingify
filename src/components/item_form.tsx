import { Category } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import React, { useState } from "react";
import Spinner from "./spinner";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  note: z.string().optional(),
  imageUrl: z.union([z.string().url().optional(), z.string().default("")]),
});

type FormData = z.infer<typeof formSchema>;

const ItemForm = () => {
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isCategoryValid, setCategoryValidity] = useState<
    boolean | undefined
  >();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  // TODO: handle error state
  // Fetch categories from api
  const { data, error } = useSWR("/api/categories", fetcher, {
    onSuccess: (data) => {
      setFilteredCategories(data?.categories || []);
    },
  });
  const categories = (data?.categories || []) as Category[];

  // const onCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value?.trim() || "";
  //   setCategory(value);

  //   const filtered = categories.filter(({ name }) => name.startsWith(value));
  //   setFilteredCategories(filtered);
  // };

  const onSelectCategory = (category: Category) => {
    setCategory(category);
    setCategoryValidity(true);
  };

  const onSubmit = async (data: FormData) => {
    if (category === null) {
      setCategoryValidity(false);
      return;
    }

    const res = await fetch("/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        categoryId: category.id,
        categoryName: category.name,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log({ data });
    } else {
      // Show alert indicating error
    }
  };

  return (
    <section className="px-10 py-8 h-screen overflow-y-auto grow shrink-0 w-[24rem] fixed top-0 right-0 z-30 flex flex-col">
      <h2 className="text-2xl font-medium mb-8">Add a new item</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <label htmlFor="itemName" className="text-sm mb-1.5 font-medium">
            Name
          </label>
          <input
            id="itemName"
            type="text"
            placeholder="Enter a name"
            className="py-5 px-4 border-2 border-[#bdbdbd] bg-transparent rounded-xl w-full text-sm placeholder:text-sm placeholder:text-[#bdbdbd]"
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
            className="py-5 px-4 h-28 resize-none border-2 border-[#bdbdbd] bg-transparent rounded-xl w-full text-sm placeholder:text-sm placeholder:text-[#bdbdbd]"
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
            className="py-5 px-4 border-2 border-[#bdbdbd] bg-transparent rounded-xl w-full text-sm placeholder:text-sm placeholder:text-[#bdbdbd]"
            {...register("imageUrl")}
          />
          {errors.imageUrl && <small>{errors.imageUrl?.message}</small>}
        </div>

        <div className="mb-10">
          <p>Category</p>
          {/* <input
            type="text"
            id="itemCategory"
            className="py-5 px-4 border-2 border-[#bdbdbd] bg-transparent rounded-xl w-full text-sm placeholder:text-sm placeholder:text-[#bdbdbd]"
            value={category}
            onChange={onCategoryChange}
          /> */}
          {!isCategoryValid && <small>Select a category</small>}

          <div className="mt-3 border-1 max-h-[11.25rem] overflow-y-auto border-[#E0E0E0] bg-white shadow-sm rounded-xl px-2 py-3">
            {filteredCategories.map((c) => (
              <button
                className="w-full px-5 py-3 text-start text-lg text-[#828282] font-medium rounded-xl hover:bg-[#f2f2f2] hover:text-[#34333a]"
                key={c.id}
                type="button"
                onClick={() => onSelectCategory(c)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-5 w-full items-center z-30">
          <button type="button" className="py-4 px-6 rounded-xl font-bold">
            cancel
          </button>
          <button
            type="submit"
            className="text-white bg-[#F9A109] py-4 px-6 flex justify-between rounded-xl font-bold"
          >
            Save
            <Spinner loading={isSubmitting} className="fill-white" />
          </button>
        </div>
      </form>
    </section>
  );
};

export default ItemForm;
