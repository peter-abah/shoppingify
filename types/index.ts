import { Category } from "@prisma/client";

export type ClientUser = {
  id: string;
  accountType: "local" | "online";
};

export type ItemData = {
  name: string;
  note?: string;
  imageUrl?: string;
  categoryId: Category["id"];
  categoryName: Category["name"];
};