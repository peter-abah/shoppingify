import { ShoppingList, ShoppingListState } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

type ResponseData =
  | {
      shoppingList: ShoppingList;
    }
  | { errorMsg: string };

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ errorMsg: "Unauthenicated, please login" });
    return;
  }

  if (req.method == "GET") {
    let shoppingList = await prisma.shoppingList.findFirst({
      where: { state: ShoppingListState["ACTIVE"], ownerId: session.user.id },
    });

    if (!shoppingList) {
      // Create new active list if user has no active list
      shoppingList = await prisma.shoppingList.create({
        data: { name: "Shopping List", ownerId: session.user.id },
      });
    }

    if (!shoppingList) {
      res.status(404).json({ errorMsg: "Unable to get shopping list" });
      return;
    }

    res.status(200).json({ shoppingList });
  }
}

export default handler;
