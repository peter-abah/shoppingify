import { User } from "@prisma/client";
import { prisma } from "../../prisma/prisma";

async function createUserDefaultCategories(userID: User["id"]) {
  // Create default categories
  const [food, meat, beverage] = await Promise.all([
    prisma.category.create({
      data: {
        name: "Food and Vegetables",
        ownerId: userID,
      },
    }),
    prisma.category.create({
      data: {
        name: "Meat and Fish",
        ownerId: userID,
      },
    }),
    prisma.category.create({
      data: {
        name: "Beverages",
        ownerId: userID,
      },
    }),
  ]);

  return { food, meat, beverage };
}

type DefaultCategories = Awaited<ReturnType<typeof createUserDefaultCategories>>

async function createUserDefaultItems(userID: User["id"], categories: DefaultCategories) {
  const items = [
    {
      name: "Avocado",
      categoryId: categories.food.id,
      categoryName: categories.food.name,
      ownerId: userID,
    },
    {
      name: "Banana",
      categoryId: categories.food.id,
      categoryName: categories.food.name,
      ownerId: userID,
    },
    {
      name: "Bunch of Carrots",
      categoryId: categories.food.id,
      categoryName: categories.food.name,
      ownerId: userID,
    },
    {
      name: "Watermelon",
      categoryId: categories.food.id,
      categoryName: categories.food.name,
      ownerId: userID,
    },
    {
      name: "Pepper",
      categoryId: categories.food.id,
      categoryName: categories.food.name,
      ownerId: userID,
    },
    {
      name: "Chicken 1kg",
      categoryId: categories.meat.id,
      categoryName: categories.meat.name,
      ownerId: userID,
    },
    {
      name: "Salmon",
      categoryId: categories.meat.id,
      categoryName: categories.meat.name,
      ownerId: userID,
    },
    {
      name: "Beef 1kg",
      categoryId: categories.meat.id,
      categoryName: categories.meat.name,
      ownerId: userID,
    },
    {
      name: "Lucozade boost can pack",
      categoryId: categories.beverage.id,
      categoryName: categories.beverage.name,
      ownerId: userID,
    },
    {
      name: "Cocacola drink pack",
      categoryId: categories.beverage.id,
      categoryName: categories.beverage.name,
      ownerId: userID,
    },
  ];
  await prisma.item.createMany({ data: items });
}

export async function createUserDefaultData(userID: User["id"]) {
  const categories = await createUserDefaultCategories(userID);
  await createUserDefaultItems(userID, categories);
}
