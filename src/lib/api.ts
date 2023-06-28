import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { ItemData } from "../../types";
import { WithSerializedDates } from "../../types/generic";
import { Category } from "@prisma/client";

export async function fecthActiveList(url: string) {
  return fetch(url, {
    method: "POST",
  }).then((res) => res.json());
}

export const itemAPIActions = {
  async create(itemData: ItemData) {
    const res = await fetch("/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    });

    if (!res.ok) throw res;

    const { item } = await res.json();
    return item;
  },

  async delete(itemId: string) {
    const res = await fetch(`/api/items/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw res;
  },
};

export const categoryAPIActions = {
  async create(categoryName: string) {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: categoryName }),
    });

    if (!res.ok) throw res;

    const { category } = await res.json();
    return category as WithSerializedDates<Category>;
  },

  async update(categoryID: string, categoryName: string) {
    const res = await fetch(`/api/categories/${categoryID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: categoryName }),
    });

    if (!res.ok) throw res;

    const { category } = await res.json();
    return category;
  },

  async delete(categoryID: string) {
    // Delete item in database
    const res = await fetch(`/api/categories/${categoryID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw res;
  },
};
